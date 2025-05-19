<script setup lang="ts">
import { ref } from "vue";
import api from "../services/api";

const date = ref("");
const exercises = ref([{ name: "", sets: 0, reps: 0, weight: 0 }]);

const addExercise = () => {
  exercises.value.push({ name: "", sets: 0, reps: 0, weight: 0 });
};

const submitWorkout = async () => {
  // Convert to ISO string for backend compatibility
  const isoDate = date.value
    ? new Date(date.value).toISOString()
    : new Date().toISOString();

  const payload = {
    date: isoDate,
    exercises: exercises.value.map((exercise) => ({
      name: exercise.name,
      reps: Number(exercise.reps),
      sets: Number(exercise.sets),
      weight: Number(exercise.weight),
    })),
  };

  console.log(payload);

  try {
    await api.post("/workouts", payload);
    alert("Workout submitted successfully!");

    // Reset the form after submission
    date.value = "";
    exercises.value = [{ name: "", reps: 0, sets: 0, weight: 0 }];
  } catch (error) {
    console.error(error);
    alert("Failed to submit workout. Please try again.");
  }
};
</script>

<template>
  <div class="workout-form">
    <h2>Log Workout</h2>
    <input v-model="date" type="datetime-local" />

    <div
      v-for="(exercise, index) in exercises"
      :key="index"
      class="exercise-row"
    >
      <div style="display: flex; flex-direction: column">
        <label :for="`exercise-name-${index}`">Exercise Name</label>
        <input
          :id="`exercise-name-${index}`"
          v-model="exercise.name"
          placeholder="Exercise Name"
          type="text"
          required
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <label :for="`exercise-reps-${index}`">Reps</label>
        <input
          :id="`exercise-reps-${index}`"
          v-model.number="exercise.reps"
          placeholder="Reps"
          type="number"
          min="1"
          required
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <label :for="`exercise-sets-${index}`">Sets</label>
        <input
          :id="`exercise-sets-${index}`"
          v-model.number="exercise.sets"
          placeholder="Sets"
          type="number"
          min="1"
          required
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <label :for="`exercise-weight-${index}`">Weight (kg)</label>
        <input
          :id="`exercise-weight-${index}`"
          v-model.number="exercise.weight"
          placeholder="Weight"
          type="number"
          min="0"
          required
        />
      </div>
    </div>

    <button @click="addExercise">Add Exercise</button>
    <button @click="submitWorkout">Submit</button>
  </div>
</template>
