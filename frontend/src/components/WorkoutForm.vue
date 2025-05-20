<script setup lang="ts">
import { ref, defineEmits } from "vue";
import api from "../services/api";

// Define the event emitter for notifying parent when a workout is added
const emit = defineEmits(["workout-added"]);

// Reactive state for the workout date
const date = ref("");
// Reactive state for the list of exercises
const exercises = ref([{ name: "", sets: 0, reps: 0, weight: 0 }]);

// Add a new empty exercise row
const addExercise = () => {
  exercises.value.push({ name: "", sets: 0, reps: 0, weight: 0 });
};

// Submit the workout to the backend
const submitWorkout = async () => {
  // Convert to ISO string for backend compatibility
  const isoDate = date.value
    ? new Date(date.value).toISOString()
    : new Date().toISOString();

  // Prepare the payload for the API
  const payload = {
    date: isoDate,
    exercises: exercises.value.map((exercise) => ({
      name: exercise.name,
      reps: Number(exercise.reps),
      sets: Number(exercise.sets),
      weight: Number(exercise.weight),
    })),
  };

  try {
    // Send the workout data to the backend
    await api.post("/workouts", payload);
    alert("Workout submitted successfully!");

    // Reset form fields after successful submission
    date.value = "";
    exercises.value = [{ name: "", reps: 0, sets: 0, weight: 0 }];
    emit("workout-added"); // Notify parent to refresh the workout list
  } catch (error) {
    console.error(error);
    alert("Failed to submit workout. Please try again.");
  }
};
</script>

<template>
  <div class="workout-form">
    <h2>Log Workout</h2>
    <!-- Input for workout date -->
    <input v-model="date" type="datetime-local" />

    <!-- Render input fields for each exercise -->
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

    <!-- Button to add a new exercise row -->
    <button @click="addExercise">Add Exercise</button>
    <!-- Button to submit the workout -->
    <button @click="submitWorkout">Submit</button>
  </div>
</template>
