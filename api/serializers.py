from rest_framework import serializers
from .models import Cat, Mission, Target


class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = "__all__"


class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ["id", "mission", "name", "country", "notes", "completed"]
        read_only_fields = ["id", "mission"]

    def update(self, instance, validated_data):
        mission_completed = instance.mission.completed
        is_target_completed = validated_data.get("completed", instance.completed)

        if "notes" in validated_data and (mission_completed or is_target_completed):
            raise serializers.ValidationError({
                "notes": "Notes cannot be updated when the target or mission is completed."
            })

        instance.notes = validated_data.get("notes", instance.notes)
        instance.completed = validated_data.get("completed", instance.completed)
        instance.save()
        return instance


class MissionSerializer(serializers.ModelSerializer):
    targets = TargetSerializer(many=True, required=True)
    cat = serializers.PrimaryKeyRelatedField(
        queryset=Cat.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Mission
        fields = ["id", "cat", "completed", "targets"]
        read_only_fields = ["id"]

    def validate_targets(self, value):
        names = [target.get("name") for target in value]
        if len(names) != len(set(names)):
            raise serializers.ValidationError("Targets must be unique within a mission.")
        if not value:
            raise serializers.ValidationError("At least one target is required.")
        return value

    def create(self, validated_data):
        targets_data = validated_data.pop("targets", [])
        mission = Mission.objects.create(**validated_data)

        for target_data in targets_data:
            Target.objects.create(
                mission=mission,
                **target_data,
            )

        return mission

    def update(self, instance, validated_data):
        validated_data.pop("targets", None)
        instance.cat = validated_data.get("cat", instance.cat)
        instance.completed = validated_data.get("completed", instance.completed)
        instance.save()
        return instance
