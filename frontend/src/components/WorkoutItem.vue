<script setup lang="ts">
import { ref, watch } from "vue";
import api from "../services/api";
import ExerciseInputs from "./ExerciseInputs.vue";
import type { Workout } from "../models/workout";
import type { Exercise } from "../models/exercise";

const props = defineProps<{
  workout: Workout;
  onChanged: () => void;
}>();

const editing = ref(false);
const formDate = ref("");
const formExercises = ref<any[]>([]);

watch(
  () => props.workout,
  (workout) => {
    if (editing.value && workout) {
      formDate.value = new Date(workout.date).toISOString().slice(0, 16);
      formExercises.value = workout.exercises.map((exercise: Exercise) => ({
        ...exercise,
      }));
    }
  },
);

const startEdit = () => {
  editing.value = true;
  formDate.value = new Date(props.workout.date).toISOString().slice(0, 16);
  formExercises.value = props.workout.exercises.map((exercise: Exercise) => ({
    ...exercise,
  }));
};

const cancelEdit = () => {
  editing.value = false;
  formExercises.value = [];
};

const saveEdit = async () => {
  await api.put(`/workouts/${props.workout.id}`, {
    date: new Date(formDate.value).toISOString(),
    exercises: formExercises.value.map((exercise: Exercise) => ({
      name: exercise.name,
      reps: Number(exercise.reps),
      sets: Number(exercise.sets),
      weight: Number(exercise.weight),
    })),
  });
  editing.value = false;
  formExercises.value = [];
  props.onChanged();
  alert("Workout updated!");
};

const deleteWorkout = async () => {
  if (!confirm("Are you sure you want to delete this workout?")) return;
  await api.delete(`/workouts/${props.workout.id}`);
  props.onChanged();
};
</script>

<template>
  <div class="workout-item">
    <div v-if="!editing">
      <h3>{{ new Date(props.workout.date).toLocaleString() }}</h3>
      <ul>
        <li v-for="exercise in props.workout.exercises" :key="exercise.id">
          {{ exercise.name }}: {{ exercise.sets }} sets ×
          {{ exercise.reps }} reps @ {{ exercise.weight }} kg
        </li>
      </ul>
      <button @click="startEdit" class="btn-edit">Edit</button>
      <button @click="deleteWorkout" class="btn-delete">Delete</button>
    </div>
    <div v-else>
      <input v-model="formDate" type="datetime-local" />
      <ExerciseInputs v-model:exercises="formExercises" />
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
</template>
