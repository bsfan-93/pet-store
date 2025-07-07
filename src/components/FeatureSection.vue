<template>
  <div class="feature-section-wrapper">
    <div class="feature-section">
      <div class="image-pane">
        <div
          v-for="feature in features"
          :key="feature.id + '-img'"
          class="image-container"
          :class="{
            'is-active': activeFeatureId === feature.id,
            'is-exiting': exitingFeatureId === feature.id,
          }"
        >
          <img :src="feature.imageSrc" :alt="feature.title" />
        </div>
      </div>
      <div class="text-pane">
        <ul>
          <li
            v-for="(feature, index) in features"
            :key="feature.id + '-text'"
            :ref="el => featureTextRefs[index] = el"
            :data-id="feature.id"
            class="text-item"
            :class="{ active: activeFeatureId === feature.id }"
          >
            <span v-if="feature.isNew && activeFeatureId === feature.id" class="new-tag">New</span>
            <h3>{{ feature.title }}</h3>
            <div v-if="activeFeatureId === feature.id" class="details">
              <p v-if="feature.subtitle">{{ feature.subtitle }}</p>
              <div v-if="feature.showButtons" class="buttons">
                <button class="buy-now-btn">Buy Now</button>
                <a href="#" class="learn-more-link">Learn More <el-icon><Right /></el-icon></a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const features = ref([
  { id: 'camera', title: 'Scout Smart Camera', subtitle: 'Goodbye worries. Hello Scout.', imageSrc: '/images/feature-camera.jpg', isNew: true, showButtons: true, },
  { id: 'granary', title: 'Granary Series', subtitle: 'Award-winning automatic feeders', imageSrc: '/images/feature-feeder.jpg', showButtons: true, },
  { id: 'rfid', title: 'One RFID Feeder', subtitle: 'Feeding made personal for multiple pet families.', imageSrc: '/images/feature-rfid-feeder.jpg', showButtons: true, },
  { id: 'fountain', title: 'Dockstream Cordless Fountain', subtitle: 'Fresh, flowing water to encourage hydration.', imageSrc: '/images/feature-fountain.jpg', showButtons: true, },
]);

const activeFeatureId = ref(features.value[0].id);
const exitingFeatureId = ref(null);
const featureTextRefs = ref([]);
let observer = null;

watch(activeFeatureId, (newId, oldId) => {
  if (oldId) {
    exitingFeatureId.value = oldId;
    setTimeout(() => {
      if (exitingFeatureId.value === oldId) {
        exitingFeatureId.value = null;
      }
    }, 800);
  }
});

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeFeatureId.value = entry.target.dataset.id;
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );
  featureTextRefs.value.forEach(el => {
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.feature-section-wrapper { padding: 80px 0; background-color: #F4F3F0; }
.feature-section { display: flex; max-width: var(--container-width, 1200px); margin: 0 auto; gap: 10%; }
.image-pane { width: 50%; height: 80vh; position: sticky; top: 10vh; }
.image-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transform: translate(-30%, 30%) scale(0.8); transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
.image-container.is-active { opacity: 1; transform: translate(0, 0) scale(1); }
.image-container.is-exiting { opacity: 0; transform: translate(30%, -30%) scale(0.8); }
.image-container img { width: 100%; height: 100%; object-fit: contain; }
.text-pane { width: 40%; }
.text-pane ul { list-style: none; padding: 0; margin: 0; }
.text-item { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; position: relative; padding-left: 20px; }
.text-item.active::before { content: ''; display: block; width: 3px; height: 80%; top: 10%; background-color: #000; position: absolute; left: 0; }
.text-item h3 { font-size: 24px; font-weight: 500; color: #888; margin: 0; transition: all 0.4s ease; }
.text-item.active h3 { color: #000; font-size: 32px; font-weight: 600; }
.new-tag { font-size: 12px; color: #333; margin-bottom: 8px; display: block; }
.details { animation: fadeInDetail 0.5s ease forwards; }
.details p { font-size: 16px; color: #666; margin: 8px 0 0 0; }
.buttons { margin-top: 25px; display: flex; align-items: center; gap: 20px; }
.buy-now-btn { padding: 12px 24px; background-color: var(--accent-color, #6a994e); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
.learn-more-link { color: #333; text-decoration: none; font-weight: 500; display: flex; align-items: center; }
.learn-more-link .el-icon { margin-left: 5px; }
@keyframes fadeInDetail { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>