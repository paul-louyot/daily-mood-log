<template>
  <Layout>
    <b-container>
      <b-row class="mb-5">
        <b-col md="6" class="mb-2">
          <h1>Daily mood log</h1>
        </b-col>
        <b-col md="6" class="d-flex justify-content-between">
          <b-button
            variant="primary"
            v-on:click="fillWithMockupData()"
            >
            Simuler
          </b-button>
            <b-button
              variant="secondary"
              v-on:click="resetForm()"
              >
              Réinitialiser
            </b-button>
        </b-col>
      </b-row>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
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
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
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
      </div>
      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group label="Technique">
          <b-form-radio-group
            v-model="selectedTechnique"
            :options="techniques"
            stacked
            >
          </b-form-radio-group>
        </b-form-group>

        <b-form-group
          v-if="selectedTechnique == 'rational_response'"
        >
          <b-form-textarea
            v-model="rationalResponse"
            placeholder=""
            rows="3"
            max-rows="6"
            >
          </b-form-textarea>
        </b-form-group>

        <template v-if="selectedTechnique == 'evidence_technique'">
          <b-row class="mb-2">
            <b-col>
              Pensée : {{ automaticThought.value }}
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                label="Indices pour"
                >
                <b-form-textarea
                  v-model="evidenceInFavor"
                  placeholder=""
                  rows="3"
                  max-rows="6"
                  ></b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                label="Indices contre"
                >
                <b-form-textarea
                  v-model="evidenceAgainst"
                  placeholder=""
                  rows="3"
                  max-rows="6"
                  ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </template>

        <template v-if="selectedTechnique == 'blame_pie'">
          <div class="d-flex justify-content-center my-4">
            🔧 Fonctionnalité en cours de développement 🔧
          </div>
          <b-form-group
            label="Problème"
            >
            <b-form-textarea
              v-model="blameOrigin"
              placeholder="Décrivez ce pour quoi vous vous blâmez"
              rows="2"
              max-rows="6"
              ></b-form-textarea>
          </b-form-group>
          <b-form-group label="Causes de ce problème">
            <template v-for="blame in blameList">
              <b-form-input
                v-model="blame.value"
              >
              </b-form-input>
            </template>
          </b-form-group>
          <b-row>
            <b-col>
              <PieChart v-bind:data="chartData" v-bind:options="chartOptions" class="p-sm-5"/>
            </b-col>
          </b-row>
        </template>
        <b-form-group
          v-if="selectedTechnique == 'inquiry_technique'"
          label="Compte-rendu"
        >
          <b-form-textarea
            v-model="inquiryReport"
            placeholder=""
            rows="3"
            max-rows="6"
            >
          </b-form-textarea>
        </b-form-group>
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Re-notez votre degré de croyance dans votre pensée automatique"
          >
          <b-row class="my-1">
            <b-col cols="8" offset="2" offset-sm="0" sm="4">
              {{ automaticThought.credenceAfter }} %
            </b-col>
          <b-col cols="8" offset="2" offset-sm="0" sm="8">
            <b-form-input
              v-model="automaticThought.credenceAfter"
              v-bind:disabled="automaticThought.credenceBefore == 0"
              type="range"
              min="0"
              max="100"
              step="10"
              ></b-form-input>
          </b-col>
          </b-row>
        </b-form-group>

        <b-form-group
          id="upsetting-event"
          label="Re-notez vos émotions"
          >
          <template v-if="noEmotionsFilled">
            <b-row class="my-1">
              <b-col cols="8" offset="2" offset-sm="4">
                <b-form-input v-model="voidModel" type="range" min="0" max="100" step="10" disabled>
                </b-form-input>
              </b-col>
            </b-row>
          </template>
          <template v-else>
            <template v-for="emotion in emotions" >
              <b-row class="my-1" v-if="emotion.valueBefore != 0" :key="emotion.name">
                <b-col cols="8" offset="2" offset-sm="0" sm="4">
                  <div class="d-flex justify-content-between">
                    <div>{{ emotion.name }} :</div>
                    <div>{{ emotion.valueAfter }}</div>
                  </div>
                </b-col>
                <b-col cols="8" offset="2" offset-sm="0">
                  <b-form-input v-model="emotion.valueAfter" type="range" min="0" max="100" step="10"></b-form-input>
                </b-col>
              </b-row>
            </template>
          </template>
        </b-form-group>
      </div>
      <div class="d-flex align-items-center justify-content-center mt-4 mb-3">
        <b-button
          variant="primary"
          v-on:click="downloadPDF()"
        >
          Télécharger le compte-rendu (PDF)
        </b-button>
      </div>
      <b-form-group>
        <div class="d-flex align-items-center justify-content-between mb-2">
          <b>
            Compte-rendu
          </b>
        </div>
        <div class="border border-primary rounded-lg shadow">
          <div class="p-4" ref="report">
            <div class="mb-3">
              <div>
                <b>Événement contrariant :</b>
              </div>
              <div>
                {{ upsettingEvent }}
              </div>
            </div>
            <div class="mb-3">
              <div>
                <b>Évolution des émotions :</b>
              </div>
              <template v-for="emotion in emotions">
                <div v-if="emotion.valueBefore != 0" :key="emotion.name">
                  {{ emotion.name }} : de {{ emotion.valueBefore }}&nbsp;% à {{ emotion.valueAfter }}&nbsp;%
                </div>
              </template>
            </div>
            <div class="mb-3">
              <b>Pensée automatique :</b>
              {{ automaticThought.value }}
            </div>
            <div class="mb-3">
              <b>Évolution du degré de croyance&nbsp;:</b>
              <template v-if="automaticThought.credenceBefore !== 0">
                de {{ automaticThought.credenceBefore }}&nbsp;% à {{ automaticThought.credenceAfter }}&nbsp;%
              </template>
            </div>
            <div class="mb-3">
              <div>
                <b>Distorsions identifiées :</b>
              </div>
              <div>
                {{ selectedDistorsions.join(', ') }}
              </div>
            </div>
            <div class="mb-3">
              <b>Technique utilisée :</b>
              {{ selectedTechniqueToString }}
            </div>

            <template v-if="selectedTechnique === 'rational_response'">
              <div>
                <b>{{ selectedTechniqueToString }} :</b>
              </div>
              <div v-html="stringToHTML(rationalResponse)"></div>
            </template>
            <template v-if="selectedTechnique === 'evidence_technique'">
              <div class="font-weight-bold">Indices pour :</div>
              <div class="mb-2" v-html="stringToHTML(evidenceInFavor)"></div>
              <div class="font-weight-bold">Indices contre :</div>
              <div class="mb-1" v-html="stringToHTML(evidenceAgainst)"></div>
            </template>

            <template v-if="selectedTechnique === 'inquiry_technique'">
              <div class="font-weight-bold">Résultat :</div>
              <div v-html="stringToHTML(inquiryReport)"></div>
            </template>
            <template v-if="selectedTechnique === 'blame_pie'">
              <!-- TODO -->
            </template>
          </div>
        </div>
      </b-form-group>
    </b-container>
  </Layout>
</template>

<script>
import PieChart from '~/components/PieChart.vue'
export default {
  components: {
    PieChart
  },
  data() {
    return {
      automaticThought: {
        value: '',
        credenceBefore: 0,
        credenceAfter: 0,
      },
      blameOrigin: '',
      blameList: [
        { value: '', strength: 1},
        { value: '', strength: 1},
        { value: '', strength: 1},
        { value: '', strength: 1},
        { value: '', strength: 1},
      ],
      //chartData: {
      //  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      //  datasets: [{
      //    data: [12, 19, 3, 5, 2, 3],
      //    backgroundColor: [
      //      'rgba(255, 99, 132, 0.2)',
      //      'rgba(54, 162, 235, 0.2)',
      //      'rgba(255, 206, 86, 0.2)',
      //      'rgba(75, 192, 192, 0.2)',
      //      'rgba(153, 102, 255, 0.2)',
      //      'rgba(255, 159, 64, 0.2)'
      //    ],
      //    borderColor: [
      //      'rgba(255, 99, 132, 1)',
      //      'rgba(54, 162, 235, 1)',
      //      'rgba(255, 206, 86, 1)',
      //      'rgba(75, 192, 192, 1)',
      //      'rgba(153, 102, 255, 1)',
      //      'rgba(255, 159, 64, 1)'
      //    ],
      //  }]
      //},
      chartOptions: {
        animation: {
          duration: 0,
        },
        legend: {
          display: true
        }
      },
      upsettingEvent: '',
      report: '',
      voidModel: "0",
      rationalResponse: '',
      inquiryReport: '',
      evidenceAgainst: '',
      evidenceInFavor: '',
      selectedDistorsions: [],
      selectedTechnique: '',
      distorsions: [
        //'All-or-nothing thinking',
        //'Overgeneralization',
        //'Mental Filter',
        //'Disqualifying the positive',
        //'Mind Reading',
        //'Fortune Telling',
        //'Magnification or Minimization',
        //'Emotional Reasoning',
        //'Should statements',
        //'Labeling',
        //'Personalization or Blame',
        'Pensée en tout ou rien',
        'Généralisation à outrance',
        'Filtre mental',
        'Rejet du positif',
        'Lecture de pensée',
        'Erreur de prévision',
        'Exagération ou minimisation',
        'Raisonnement émotif',
        '"Je dois/devrais"',
        'Erreur d\'étiquetage',
        'Personalisation ou blâme'
      ],
      emotions: [
        { name: 'Triste', valueBefore: "0", valueAfter: "0" },
        { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
        { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
        { name: 'En colère', valueBefore: "0", valueAfter: "0" },
        { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
        { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
        { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
        { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
        { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
        { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
        { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
        { name: 'Déprimé', valueBefore: "0", valueAfter: "0" },
        { name: 'Désespéré', valueBefore: "0", valueAfter: "0" },
      ],
      techniques: [
        { text: 'Réponse rationnelle', value: 'rational_response' },
        { text: 'Technique de la preuve', value: 'evidence_technique' },
        { text: 'Tarte au blâme', value: 'blame_pie' },
        { text: 'Écoute active', value: 'active_listening' },
        { text: 'Technique de l\'enquête', value: 'inquiry_technique' },
      ],
    }
  },
  computed: {
    chartData(){
      return {
        labels: this.blameList.map(blame => blame.value),
        datasets: [{
          data: this.blameList.map(blame => blame.strength),
          backgroundColor: this.chartColors(211, 100, 30, this.blameList),
        }]
      }
    },
    fileContent(){
      return [
        `Événement contrariant : ${this.upsettingEvent}`,
        `Émotions :\n${this.formattedEmotions(this.emotions)}`,
        `Pensée automatique : ${this.automaticThought.value}`,
        `Évolution du degré de croyance : de ${this.automaticThought.credenceBefore} % à ${this.automaticThought.credenceAfter} %`,
        `Distorsions identifiées : ${this.selectedDistorsions.join(', ')}`,
        `Technique utilisée : ${this.selectedTechniqueToString}`,
        `Réponse : ${(this.rationalResponse)}`
      ].join('\n\n')
    },
    selectedTechniqueToString(){
      var technique = this.techniques.find(x => x.value == this.selectedTechnique)
      if (technique){
        return technique.text;
      } else {
        return '';
      }
    },
    noEmotionsFilled(){
      return this.emotions.map(emotion => emotion.valueBefore === "0").every(x => x === true);
    },
  },
  metaInfo: {
    title: 'Accueil'
  },
  methods: {
    addData(){
      this.blameList.push({value: 'test', strength: 1});
    },
    addScript(url){
      var script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      document.head.appendChild(script);
    },
    chartColors(hue, saturation, light, array){
      return array.map((x, index) => {
        return `hsl(${hue}, ${saturation}%, ${light + 10 * index}%)`
      });
    },
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
      var today = new Date();
      var date = [today.getFullYear(), (today.getMonth() + 1), today.getDate()].join('-');
      var fileName = "compte-rendu_" + date;

      var element = this.$refs.report
      var opt = {
        filename: fileName,
      };
      html2pdf().set(opt).from(element).save();
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
    },
    fillWithMockupData(){
      this.automaticThought = {
        value: 'Je suis nul',
        credenceBefore: 80,
        credenceAfter: 0,
      };
      this.upsettingEvent = 'Il n\'y a plus de beurre de cacahuète en réserve';
      this.selectedDistorsions = ['Erreur d\'étiquetage'];
      this.selectedTechnique = 'rational_response';
      this.rationalResponse = 'J\'ai le droit d\'oublier des choses';
      this.emotions = [
        { name: 'Triste', valueBefore: "0", valueAfter: "0" },
        { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
        { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
        { name: 'En colère', valueBefore: "80", valueAfter: "0" },
        { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
        { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
        { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
        { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
        { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
        { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
        { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
        { name: 'Déprimé', valueBefore: "80", valueAfter: "0" },
        { name: 'Désespéré', valueBefore: "60", valueAfter: "0" },
      ];
    },
    resetForm(){
      this.automaticThought = {
        value: '',
        credenceBefore: 0,
        credenceAfter: 0,
      };
      this.upsettingEvent = '';
      this.selectedDistorsions = [];
      this.selectedTechnique = '';
      this.rationalResponse = '';
      this.inquiryReport = '';
      this.emotions = [
        { name: 'Triste', valueBefore: "0", valueAfter: "0" },
        { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
        { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
        { name: 'En colère', valueBefore: "0", valueAfter: "0" },
        { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
        { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
        { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
        { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
        { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
        { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
        { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
        { name: 'Déprimé', valueBefore: "0", valueAfter: "0" },
        { name: 'Désespéré', valueBefore: "0", valueAfter: "0" },
      ];
    },
    stringToHTML(string){
      return string.replace(/\n/g, '<br>')
    },
  },
  mounted() {
    this.addScript('https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js');
  },
}
</script>
