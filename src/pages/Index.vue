<template>
  <Layout>
    <b-container>
      <h1>Daily mood log</h1>
      <b-form-group
        label="Événement contrariant"
      >
        <b-form-textarea
          v-model="upsettingEvent"
          placeholder="Décrivez l'événement qui vous a troublé"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="emotions-before"
        label="Notez vos émotions"
      >
        <b-row class="my-1" v-for="emotion in emotions" :key="emotion.name">
          <b-col cols="8" offset="2" offset-sm="0" sm="4">
            <div class="d-flex justify-content-between">
              <div>{{ emotion.name }} :</div>
              <div>{{ emotion.valueBefore }}</div>
            </div>
          </b-col>
          <b-col cols="8" offset="2" offset-sm="0" sm="8">
          <b-form-input v-model="emotion.valueBefore" type="range" min="0" max="100" step="10"></b-form-input>
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
          <b-col cols="8" offset="2" offset-sm="0" sm="4">
            {{ automaticThought.credenceBefore }} %
          </b-col>
          <b-col cols="8" offset="2" offset-sm="0" sm="8">
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
        <b-form-radio-group
          v-model="selectedTechnique"
          :options="techniques"
          name="flavour-1"
          stacked
        ></b-form-radio-group>
      </b-form-group>
      <b-form-group
        id="upsetting-event"
        label="Re-notez vos émotions"
      >
        <template v-for="emotion in emotions" >
          <b-row class="my-1" v-if="emotion.valueBefore != 0" :key="emotion.name">
            <b-col cols="8" offset="2" offset-sm="0" sm="4">
              <div class="d-flex justify-content-between">
                <div>{{ emotion.name }} :</div>
                <div>{{ emotion.valueAfter }}</div>
              </div>
            </b-col>
            <b-col cols="8" offset="2" offset-sm="0" sm="8">
              <b-form-input v-model="emotion.valueAfter" type="range" min="0" max="100" step="10"></b-form-input>
            </b-col>
          </b-row>
        </template>
      </b-form-group>
      <div class="d-flex align-items-center justify-content-center mb-4">
        <b-button
          variant="primary"
          v-on:click="downloadPDF(fileContent)"
        >
          Télécharger le compte-rendu (PDF)
        </b-button>
      </div>
      <div class="d-flex align-items-center justify-content-center mb-4">
        <b-button
          variant="secondary"
          v-on:click="download('compte-rendu.txt', fileContent)"
        >
          Télécharger le compte-rendu (texte)
        </b-button>
      </div>
      <b-form-group>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <b>
          Compte-rendu
        </b>
      </div>
        <div class="border border-primary p-2 rounded-lg shadow bg-light">
          Événement contrariant : {{ upsettingEvent }}
          <br>
          <br>
          Émotions :
          <br>
          <template v-for="emotion in emotions">
            <span v-if="emotion.valueBefore != 0" :key="emotion.name">
              {{ emotion.name }} : de {{ emotion.valueBefore }}&nbsp;% à {{ emotion.valueAfter }}&nbsp;%<br>
            </span>
          </template>
          <br>
          Pensée automatique :
          {{ automaticThought.value }}
          <br>
          <br>
          Évolution du degré de croyance&nbsp;:
          <template v-if="automaticThought.credenceBefore !== 0">
            de {{ automaticThought.credenceBefore }}&nbsp;% à {{ automaticThought.credenceAfter }}&nbsp;%
          </template>
          <br>
          Distorsions identifiées :
          <br>
          {{ selectedDistorsions.join(', ') }}
          <br>
          Technique utilisée :
          <br>
          {{ selectedTechnique }}
        </div>
      </b-form-group>
    </b-container>
  </Layout>
</template>

<script>
import { jsPDF } from "jspdf";
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
      selectedTechnique: '',
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
        { name: 'Triste', valueBefore: "0", valueAfter: "0" },
        { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
        { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
        { name: 'En colère', valueBefore: "0", valueAfter: "0" },
        { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
        { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
        { name: 'Sans espoir', valueBefore: "0", valueAfter: "0" },
        { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
        { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
        { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
        { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
        { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
        { name: 'Déprimé', valueBefore: "0", valueAfter: "0" },
        { name: 'Désespéré', valueBefore: "0", valueAfter: "0" },
      ],
      techniques: [
        'Réponse rationnelle',
        'Technique de la preuve',
        'Tarte au blâme',
        'Écoute active',
      ],
    }
  },
  computed: {
    fileContent(){
      return [
        `Événement contrariant : ${this.upsettingEvent}`,
        `Émotions :\n${this.formattedEmotions(this.emotions)}`,
        `Pensée automatique : ${this.automaticThought.value}`,
        `Évolution du degré de croyance : de ${this.automaticThought.credenceBefore} % à ${this.automaticThought.credenceAfter} %`,
        `Distorsions identifiées : ${this.selectedDistorsions.join(', ')}`,
        `Technique utilisée : ${this.selectedTechnique}`
      ].join('\n\n')
    },
  },
  metaInfo: {
    title: 'Accueil'
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
    },
    downloadPDF(text){
      const doc = new jsPDF();
      doc.text(text, 10, 20);
      var today = new Date();
      var date = [today.getFullYear(), (today.getMonth() + 1), today.getDate()].join('-');
      doc.save("compte-rendu-" + date);
    },
    emailLink(){
      return `mailto:pa.louyot@gmail.com?body=${this.fileContent}`
    },
    formattedEmotions(emotions){
      return emotions
        .filter( e => e.valueBefore != 0 )
        .map( e => this.formattedEmotion(e) ).join('\n')
    },
    formattedEmotion(emotion){
      return `${emotion.name} : de ${emotion.valueBefore} % à ${emotion.valueAfter} %`
    }
  },
  mounted() {
  },
}
</script>
