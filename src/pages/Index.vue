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
            {{ emotion.name }} : {{ emotion.valueBefore }}
          </b-col>
          <b-col sm="8">
          <b-form-input id="range-1" v-model="emotion.valueBefore" type="range" min="0" max="100" step="10"></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
        id="automatic-thought"
        label="Pensée automatique"
      >
        <b-form-input
          v-model="automaticThought.value"
          placeholder="Pensée automatique"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        label="Estimez votre degré de croyance dans cette pensée"
      >
        <b-row class="my-1">
          <b-col sm="4">
            {{ automaticThought.credenceBefore }}
          </b-col>
          <b-col sm="8">
            <b-form-input v-model="automaticThought.credenceBefore" type="range" min="0" max="100" step="10"></b-form-input>
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
        label="Distorsions"
      >
        <b-form-checkbox-group
          v-model="selectedDistorsions"
          :options="distorsions"
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
        id="upsetting-event"
        label="Re-notez vos émotions"
      >
        <template v-for="emotion in emotions" >
          <b-row class="my-1" v-if="emotion.valueBefore !== 0" :key="emotion.name">
            <b-col sm="4">
              {{ emotion.name }} : {{ emotion.valueAfter }}
            </b-col>
            <b-col sm="8">
              <b-form-input id="range-1" v-model="emotion.valueAfter" type="range" min="0" max="100" step="10"></b-form-input>
            </b-col>
          </b-row>
        </template>
      </b-form-group>
      <b-form-group
        label="Compte-rendu"
      >
        <div class="border border-primary p-2 rounded-lg shadow bg-light">
          Événement contrariant : {{ upsettingEvent }}
          <br>
          <br>
          Émotions négatives :
          <br>
          <template v-for="emotion in emotions">
            <span v-if="emotion.valueBefore !== 0" :key="emotion.name">
              {{ emotion.name }} : de {{ emotion.valueBefore }}% à {{ emotion.valueAfter }}%<br>
            </span>
          </template>
          <br>
          Pensée automatique :
          {{ automaticThought.value }}
          <br>
          Degré de croyance passé de {{ automaticThought.credenceBefore }} % à {{ automaticThought.credenceAfter }} %
          <br>
          Distorsions identifiées :
          <br>
          {{ selectedDistorsions.join(', ') }}
        </div>
      </b-form-group>
    </b-container>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      automaticThought: {
        value: '',
        credenceBefore: 0,
        credenceAfter: 0,
      },
      upsettingEvent: '',
      report: '',
      value: 0,
      value2: 0,
      automaticThoughtCredence: 0,
      selectedDistorsions: [],
      selectedTechniques: [],
      distorsions: [
        'All-or-nothing thinking',
        'Overgeneralization',
        'Mental Filter',
        'Disqualifying the positive',
        'Mind Reading',
        'Fortune Telling',
        'Magnification or Minimization',
        'Emotional Reasoning',
        'Should statements',
        'Labeling',
        'Personalization or Blame',
      ],
      emotions: [
        { name: 'Triste', valueBefore: 0, valueAfter: 0 },
        { name: 'Embarassé', valueBefore: 0, valueAfter: 0 },
        { name: 'Frustré', valueBefore: 0, valueAfter: 0 },
        { name: 'En colère', valueBefore: 0, valueAfter: 0 },
        { name: 'Coupable', valueBefore: 0, valueAfter: 0 },
        { name: 'Esseulé', valueBefore: 0, valueAfter: 0 },
        { name: 'Sans espoir', valueBefore: 0, valueAfter: 0 },
        { name: 'Honteux', valueBefore: 0, valueAfter: 0 },
        { name: 'Inférieur', valueBefore: 0, valueAfter: 0 },
        { name: 'Inadéquat', valueBefore: 0, valueAfter: 0 },
        { name: 'Défectueux', valueBefore: 0, valueAfter: 0 },
        { name: 'Anxieux', valueBefore: 0, valueAfter: 0 },
        { name: 'Déprimé', valueBefore: 0, valueAfter: 0 },
        { name: 'Désespéré', valueBefore: 0, valueAfter: 0 },
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
