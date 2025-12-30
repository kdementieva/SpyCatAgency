import requests
from django.db import models
from django.core.exceptions import ValidationError


class Cat(models.Model):
    name = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField()
    breed = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        try:
            response = requests.get(
                "https://api.thecatapi.com/v1/breeds",
                timeout=5,
            )
            response.raise_for_status()
        except requests.RequestException:
            raise ValidationError({
                "breed": "Breed validation service is unavailable."
            })

        breeds = response.json()
        valid_breeds = {b["name"].lower() for b in breeds}

        if self.breed.lower() not in valid_breeds:
            raise ValidationError({
                "breed": f"'{self.breed}' is not a valid cat breed."
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.breed})"


class Mission(models.Model):
    cat = models.ForeignKey(
        Cat,
        on_delete=models.SET_NULL,
        related_name="missions",
        null=True,
        blank=True,
    )
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Mission {self.id}"


class Target(models.Model):
    mission = models.ForeignKey(
        Mission,
        on_delete=models.CASCADE,
        related_name="targets",
    )
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    completed = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["mission", "name"],
                name="unique_target_per_mission",
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.country})"
