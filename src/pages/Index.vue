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
          label="Pensée automatique négative"
          >
          <b-form-input
            v-model="automaticThought.value"
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
            label="Identifiez la distorsion"
            >
            <b-form-checkbox-group
              v-model="selectedDistorsions"
              :options="distorsions"
              stacked
              ></b-form-checkbox-group>
          </b-form-group>
      </div>
      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-row class="mb-1">
          <b-col cols="9">Recadrage positif ?</b-col>
          <b-col cols="3">
            <div>
              <b-form-checkbox v-model="shouldShowPositiveReframing" name="check-button" switch>
              </b-form-checkbox>
            </div>
          </b-col>
        </b-row>
        <div v-if="shouldShowPositiveReframing">
          <template v-for="emotion in nonVoidEmotions" >
            <b-row class="my-2" :key="emotion.name">
              <b-col>
                <b-form-group :label="emotion.name">
                  <b-form-input
                    v-model="emotion.advantage"
                    placeholder="Avantage"
                  ></b-form-input>
                  <b-form-input
                    v-model="emotion.coreValue"
                    placeholder="Valeur fondamentale"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
          </template>
        </div>
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
          <b-form-group>
            <b-row>
              <b-col cols=8>
                Causes de ce problème
                </b-form-input>
              </b-col>
              <b-col cols=2>
                Importance
                (de 1 à 5)
              </b-col>
              <b-col cols=2>
                Vous êtes responsable
              </b-col>
            </b-row>
            <template v-for="blame in blameList">
              <b-row>
                <b-col cols=8>
                  <b-form-input
                    v-model="blame.value"
                    >
                  </b-form-input>
                </b-col>
                <b-col cols=2>
                  <b-form-select
                    v-model="blame.strength"
                    v-bind:options="strengthOptions"
                    >
                  </b-form-select>
                </b-col>
                <b-col cols=2>
                  <b-form-checkbox
                    v-model="blame.isLegit"
                    value="true"
                    >
                  </b-form-checkbox>
                </b-col>
              </b-row>
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
        <b-form-group
          v-if="selectedTechnique == 'other'"
          label="Compte-rendu"
        >
          <b-form-textarea
            v-model="otherTechniqueReport"
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
      <div class="d-flex align-items-center justify-content-between mb-2">
        <b>
          Compte-rendu
        </b>
      </div>
      <div class="border border-primary rounded-lg shadow mb-5">
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
            <table class="table table-responsive" v-if="someEmotionsFilled">
              <thead>
                <tr>
                  <th>
                    Émotions
                  </th>
                  <th class="text-center">
                    Avant (%)
                  </th>
                  <th class="text-center">
                    Après (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="emotion in nonVoidEmotions">
                  <tr>
                    <td>
                      {{ emotion.name }}
                    </td>
                    <td class="text-center">
                      {{ emotion.valueBefore }}
                    </td>
                    <td class="text-center">
                      {{ emotion.valueAfter }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mb-3">
            <b>Pensée automatique négative :</b>
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
            <b>Recadrage positif :</b>
            <table class="table table-responsive" v-if="someEmotionsFilled">
              <thead>
                <tr>
                  <th>
                    Émotions
                  </th>
                  <th class="text-center">
                    Avantages
                  </th>
                  <th class="text-center">
                    Valeurs fondamentales
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="emotion in nonVoidEmotions">
                  <tr>
                    <td>
                      {{ emotion.name }}
                    </td>
                    <td class="text-center">
                      {{ emotion.advantage }}
                    </td>
                    <td class="text-center">
                      {{ emotion.coreValue }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
            <b-row>
              <b-col>
                <PieChart v-bind:data="chartData" v-bind:options="chartOptions" class="p-sm-5"/>
              </b-col>
            </b-row>
          </template>
          <template v-if="selectedTechnique === 'other'">
            <b-row>
              <b-col>
                <div v-html="stringToHTML(otherTechniqueReport)"></div>
              </b-col>
            </b-row>
          </template>
        </div>
      </div>
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
      shouldShowPositiveReframing: false,
      blameOrigin: '',
      blameList: [
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
      ],
      strengthOptions: [1, 2, 3, 4, 5],
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
      otherTechniqueReport: '',
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
        { name: 'Triste', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Embarrassé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Frustré', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'En colère', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Coupable', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Esseulé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Honteux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Inférieur', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Inadéquat', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Défectueux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Anxieux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Déprimé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
        { name: 'Désespéré', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      ],
      techniques: [
        { text: 'Réponse rationnelle', value: 'rational_response' },
        { text: 'Technique de la preuve', value: 'evidence_technique' },
        { text: 'Tarte au blâme', value: 'blame_pie' },
        { text: 'Écoute active', value: 'active_listening' },
        { text: 'Technique de l\'enquête', value: 'inquiry_technique' },
        { text: 'Autre', value: 'other' },
      ],
    }
  },
  computed: {
    chartData(){
      return {
        labels: this.sortedBlames.map(blame => blame.value),
        datasets: [{
          data: this.sortedBlames.map(blame => blame.strength),
          backgroundColor: this.sortedBlamesColors,
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
    nonVoidEmotions(){
      return this.emotions.filter(emotion => emotion.valueBefore != 0)
    },
    noEmotionsFilled(){
      return this.emotions.map(emotion => emotion.valueBefore === "0").every(x => x === true);
    },
    someEmotionsFilled(){
      return this.nonVoidEmotions.length > 0
    },
    nonLegitBlames(){
      return this.blameList.filter(blame => blame.isLegit !== "true");
    },
    legitBlames(){
      return this.blameList.filter(blame => blame.isLegit == "true");
    },
    sortedBlames(){
      return this.legitBlames.concat(this.nonLegitBlames);
    },
    legitBlamesColors(){
      return this.chartColors(211, 100, 50, 15, this.legitBlames);
    },
    nonLegitBlamesColors(){
      return this.chartColors(208, 7, 50, 15, this.nonLegitBlames);
    },
    sortedBlamesColors(){
      return this.legitBlamesColors.concat(this.nonLegitBlamesColors);
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
    chartColors(hue, saturation, light, lightRange, blameList){
      var lightStart, step;
      if (blameList.length == 1){
        lightStart = light;
        step = 0;
      } else {
        lightStart = light - lightRange / 2;
        step = lightRange / (blameList.length - 1);
      }
      return blameList.map((x, index) => {
        return `hsl(${hue}, ${saturation}%, ${lightStart + step * index}%)`
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
      var fileName = "compte-rendu-" + date + '.pdf';

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
