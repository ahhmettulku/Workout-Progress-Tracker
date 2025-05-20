<script setup lang="ts">
import { ref } from "vue";
import WorkoutForm from "./components/WorkoutForm.vue";
import WorkoutList from "./components/WorkoutList.vue";

const workoutListRef = ref();

const refreshWorkouts = () => {
  workoutListRef.value?.fetchWorkouts();
};
</script>

<template>
  <div>
    <WorkoutForm @workout-added="refreshWorkouts" />
    <WorkoutList ref="workoutListRef" />
  </div>
</template>
