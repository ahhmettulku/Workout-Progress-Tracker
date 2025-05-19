<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  exercises: Array<{
    name: string;
    reps: number;
    sets: number;
    weight: number;
  }>;
}>();
const emit = defineEmits(["update:exercises"]);

const addExercise = () => {
  emit("update:exercises", [
    ...props.exercises,
    { name: "", reps: 0, sets: 0, weight: 0 },
  ]);
};
const updateExercise = (idx: number, field: string, value: any) => {
  const updated = props.exercises.map((exercise, i) =>
    i === idx ? { ...exercise, [field]: value } : exercise,
  );
  emit("update:exercises", updated);
};
</script>

<template>
  <div>
    <div v-for="(exercise, idx) in exercises" :key="idx">
      <input
        v-model="exercise.name"
        placeholder="Exercise name"
        @input="updateExercise(idx, 'name', exercise.name)"
      />
      <input
        v-model.number="exercise.reps"
        placeholder="Reps"
        type="number"
        @input="updateExercise(idx, 'reps', exercise.reps)"
      />
      <input
        v-model.number="exercise.sets"
        placeholder="Sets"
        type="number"
        @input="updateExercise(idx, 'sets', exercise.sets)"
      />
      <input
        v-model.number="exercise.weight"
        placeholder="Weight (kg)"
        type="number"
        @input="updateExercise(idx, 'weight', exercise.weight)"
      />
    </div>
    <button @click="addExercise">Add Exercise</button>
  </div>
</template>
