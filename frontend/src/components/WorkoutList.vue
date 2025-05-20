<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import WorkoutItem from "./WorkoutItem.vue";

const workouts = ref<any[]>([]);

const fetchWorkouts = async () => {
  const res = await api.get("/workouts");
  workouts.value = res.data;
};

onMounted(fetchWorkouts);

defineExpose({ fetchWorkouts });
</script>

<template>
  <div>
    <h2 class="workout-title">Workout History</h2>
    <WorkoutItem
      v-for="workout in workouts"
      :key="workout.id"
      :workout="workout"
      :onChanged="fetchWorkouts"
    />
  </div>
</template>
