<template>
  <Layout>
    <b-container>
      <h1>Triple column technique</h1>
      <b-form-group
        id="upsetting-event"
        label="Événement contrariant"
      >
        <b-form-textarea
          id="textarea"
          v-model="upsettingEvent"
          placeholder="Décrivez l'événement qui vous a troublé"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="upsetting-event"
        label="Notez vos émotions"
      >
        <b-row class="my-1" v-for="emotion in emotions" :key="emotion.name">
          <b-col sm="4">
            {{ emotion.name }} : {{ emotion.value }}
          </b-col>
          <b-col sm="8">
          <b-form-input id="range-1" v-model="emotion.value" type="range" min="0" max="100" step="10"></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
        id="automatic-thought"
        label="Pensée automatique"
      >
        <b-form-input
          v-model="automaticThought"
          placeholder="Pensée automatique"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Estimez votre croyance dans cette pensée"
      >
        {{ automaticThoughtCredence }}
        <b-form-input v-model="automaticThoughtCredence" type="range" min="0" max="100" step="10"></b-form-input>
      </b-form-group>
      <b-form-group
        label="Distorsions"
      >
        <b-form-checkbox-group
          v-model="selected"
          :options="distorsions"
          name="flavour-1"
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
      <b-form-group
        label="Technique"
      >
        <b-form-checkbox-group
          v-model="selectedTechniques"
          :options="techniques"
          name="flavour-1"
          stacked
        ></b-form-checkbox-group>
      </b-form-group>
      <b-form-group
        label="Compte-rendu"
      >
        <div class="border border-primary p-2 rounded-lg shadow">
          Événement contrariant: {{ upsettingEvent }}
        </div>
      </b-form-group>
    </b-container>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      upsettingEvent: '',
      report: '',
      value: 0,
      value2: 0,
      automaticThought: '',
      automaticThoughtCredence: 0,
      selected: [],
      selectedTechniques: [],
      emotions: [
        { name: 'Triste', value: 0 },
        { name: 'Embarassé', value: 0 },
        { name: 'Frustré', value: 0 },
        { name: 'En colère', value: 0 },
        { name: 'Coupable', value: 0 },
        { name: 'Esseulé', value: 0 },
        { name: 'Sans espoir', value: 0 },
        { name: 'Honteux', value: 0 },
        { name: 'Inférieur', value: 0 },
        { name: 'Inadéquat', value: 0 },
        { name: 'Défectueux', value: 0 },
        { name: 'Anxieux', value: 0 },
        { name: 'Déprimé', value: 0 },
        { name: 'Désespéré', value: 0 },
      ],
      distorsions: [
        { text: 'All-or-nothing thinking', value: 'orange' },
        { text: 'Overgeneralization', value: 'apple' },
        { text: 'Mental Filter', value: 'pineapple' },
        { text: 'Disqualifying the positive', value: 'grape' },
        { text: 'Mind Reading', value: 'grape' },
        { text: 'Fortune Telling', value: 'grape' },
        { text: 'Magnification or Minimization', value: 'grape' },
        { text: 'Emotional Reasoning', value: 'grape' },
        { text: 'Should statements', value: 'grape' },
        { text: 'Labeling', value: 'grape' },
        { text: 'Personalization or Blame', value: 'grape' },
      ],
      techniques: [
        { text: 'Réponse rationelle', value: 'orange' },
        { text: 'Technique de la preuve', value: 'apple' },
        { text: 'Tarte au blâme', value: 'pineapple' },
        { text: 'Écoute active', value: 'grape' },
      ],
    }
  },
  metaInfo: {
    title: 'TCT'
  },
  methods: {
    download(filename, text){
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  },
  mounted() {
  },
}
</script>
<style>
</style>
