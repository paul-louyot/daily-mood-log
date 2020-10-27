<template>
  <Layout>
    <b-container>
      <b-row class="mb-3">
        <b-col md="6" class="mb-2">
          <h1>Daily mood log</h1>
        </b-col>
        <!-- <b-col md="6" class="d-flex justify-content-between">
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
        </b-col> -->
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
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Émotions"
        >
          <b-row class="my-3" v-for="emotionsGroup in emotionsGroups" :key="emotionsGroup.name">
            <b-col cols="3">
              <span v-b-popover.hover.top="emotionsGroup.emotions">{{ emotionsGroup.shortName }}</span>
            </b-col>
            <b-col cols="1">
              {{ emotionsGroup.levelBefore }}
            </b-col>
            <b-col cols="8">
              <b-form-input v-model="emotionsGroup.levelBefore" type="range" min="0" max="100" step="10"></b-form-input>
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
            v-model="negativeThought.content"
            ></b-form-input>
        </b-form-group>
          <b-form-group
            label="Estimez votre degré de croyance dans cette pensée"
            >
            <b-row class="my-1">
              <b-col cols="8" offset="2" offset-sm="0" sm="4">
                {{ negativeThought.credenceBefore }} %
              </b-col>
            <b-col cols="8" offset="2" offset-sm="0" sm="8">
              <b-form-input v-model="negativeThought.credenceBefore" type="range" min="0" max="100" step="10"></b-form-input>
            </b-col>
            </b-row>
          </b-form-group>
          <b-form-group
            label="Identifiez la distorsion"
            >
            <b-form-checkbox-group
              v-model="negativeThought.distorsions"
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
          <template v-for="emotionsGroup in nonVoidEmotionsGroups" >
            <b-row class="my-2" :key="emotionsGroup.name">
              <b-col>
                <b-form-group :label="emotionsGroup.shortName">
                  <b-form-input
                    v-model="emotionsGroup.advantages"
                    placeholder="Avantages, valeurs centrales"
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
              Pensée : {{ negativeThought.content }}
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
              {{ negativeThought.credenceAfter }} %
            </b-col>
          <b-col cols="8" offset="2" offset-sm="0" sm="8">
            <b-form-input
              v-model="negativeThought.credenceAfter"
              v-bind:disabled="negativeThought.credenceBefore == 0"
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
            <template v-for="emotionsGroup in nonVoidEmotionsGroups" >
              <b-row class="my-1" :key="emotionsGroup.name">
                <b-col cols="8" offset="2" offset-sm="0" sm="4">
                  <div class="d-flex justify-content-between">
                    <div>{{ emotionsGroup.shortName }} :</div>
                    <div>{{ emotionsGroup.levelAfter }}</div>
                  </div>
                </b-col>
                <b-col cols="8" offset="2" offset-sm="0">
                  <b-form-input v-model="emotionsGroup.levelAfter" type="range" min="0" max="100" step="10"></b-form-input>
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
                <template v-for="emotionsGroup in nonVoidEmotionsGroups">
                  <tr>
                    <td>
                      {{ emotionsGroup.name }}
                    </td>
                    <td class="text-center">
                      {{ emotionsGroup.levelBefore }}
                    </td>
                    <td class="text-center">
                      {{ emotionsGroup.levelAfter }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mb-3">
            <table class="table table-responsive" v-if="someEmotionsFilled">
              <thead>
                <tr>
                  <th>
                    Pensées négatives
                  </th>
                  <th class="text-center">
                    Avant (%)
                  </th>
                  <th class="text-center">
                    Après (%)
                  </th>
                  <th class="text-center">
                    Distorsions
                  </th>
                </tr>
              </thead>
              <tbody>
                <template>
                  <tr>
                    <td>
                      {{ negativeThought.content }}
                    </td>
                    <td class="text-center">
                      {{ negativeThought.credenceBefore }}
                    </td>
                    <td class="text-center">
                      {{ negativeThought.credenceAfter }}
                    </td>
                    <td class="text-center">
                      {{ negativeThought.distorsions.join(', ') }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
                    Avantages et valeurs fondamentales
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="emotionsGroup in nonVoidEmotionsGroups">
                  <tr>
                    <td>
                      {{ emotionsGroup.name }}
                    </td>
                    <td class="text-center">
                      {{ emotionsGroup.advantages }}
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
      emotionsGroups: [
        {
          name: "sad",
          shortName: "Triste",
          emotions: "Triste, déprimé, malheureux",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "anxious",
          shortName: "Anxieux",
          emotions: "Anxieux, inquiet, paniqué, nerveux, effrayé",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "guilty",
          shortName: "Coupable",
          emotions: "Coupable, honteux",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "worthless",
          shortName: "Défectueux",
          emotions: "Inadéquat, défecteux, incompétent",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "lonely",
          shortName: "Seul",
          emotions: "Seul, indésirable, rejeté",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "embarrassed",
          shortName: "Embarassé",
          emotions: "Embarassé, bête, humilié, gêné",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "hopeless",
          shortName: "Désespéré",
          emotions: "Désespéré, découragé, pessimiste",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "frustrated",
          shortName: "Frustré",
          emotions: "Frustré, coincé, abattu, démoralisé",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "angry",
          shortName: "En colère",
          emotions: "En colère, furieux, amer, irrité, contrarié",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
        {
          name: "other",
          shortName: "Autre",
          emotions: "Autre",
          levelBefore: 0,
          levelAfter: 0,
          advantages: "",
        },
      ],
      negativeThought: {
        credenceBefore: 0,
        credenceAfter: 0,
        advantages: "",
        distorsions: [],
        content: "",
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
      strengthOptions: [0, 1, 2, 3, 4, 5],
      chartOptions: {
        animation: {
          duration: 0,
        },
        legend: {
          display: true
        }
      },
      upsettingEvent: '',
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
      // emotions: [
      //   { name: 'Triste', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Embarrassé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Frustré', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'En colère', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Coupable', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Esseulé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Honteux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Inférieur', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Inadéquat', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Défectueux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Anxieux', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Déprimé', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      //   { name: 'Désespéré', valueBefore: "0", valueAfter: "0", advantage: "", coreValue: "" },
      // ],
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
    selectedTechniqueToString(){
      var technique = this.techniques.find(x => x.value == this.selectedTechnique)
      if (technique){
        return technique.text;
      } else {
        return '';
      }
    },
    nonVoidEmotionsGroups(){
      return this.emotionsGroups.filter(emotionsGroup => emotionsGroup.levelBefore != 0)
    },
    noEmotionsFilled(){
      return this.nonVoidEmotionsGroups.length == 0
    },
    someEmotionsFilled(){
      return this.nonVoidEmotionsGroups.length > 0
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
    // addData(){
    //   this.blameList.push({value: 'test', strength: 1});
    // },
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
    // download(filename, text){
    //   var element = document.createElement('a');
    //   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    //   element.setAttribute('download', filename);

    //   element.style.display = 'none';
    //   document.body.appendChild(element);

    //   element.click();

    //   document.body.removeChild(element);
    // },
    downloadPDF(){
      var today = new Date();
      var date = [today.getFullYear(), (today.getMonth() + 1), today.getDate()].join('-');
      var fileName = "compte-rendu-" + date + '.pdf';

      var element = this.$refs.report
      var opt = {
        filename: fileName,
      };
      html2pdf().set(opt).from(element).save();
    },
    // fillWithMockupData(){
    //   this.negativeThought = {
    //     content: 'Je suis nul',
    //     credenceBefore: 80,
    //     credenceAfter: 0,
    //   };
    //   this.upsettingEvent = 'Il n\'y a plus de beurre de cacahuète en réserve';
    //   this.selectedDistorsions = ['Erreur d\'étiquetage'];
    //   this.selectedTechnique = 'rational_response';
    //   this.rationalResponse = 'J\'ai le droit d\'oublier des choses';
    //   this.emotions = [
    //     { name: 'Triste', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
    //     { name: 'En colère', valueBefore: "80", valueAfter: "0" },
    //     { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Déprimé', valueBefore: "80", valueAfter: "0" },
    //     { name: 'Désespéré', valueBefore: "60", valueAfter: "0" },
    //   ];
    // },
    // resetForm(){
    //   this.negativeThought = {
    //     content: '',
    //     credenceBefore: 0,
    //     credenceAfter: 0,
    //   };
    //   this.upsettingEvent = '';
    //   this.selectedDistorsions = [];
    //   this.selectedTechnique = '';
    //   this.rationalResponse = '';
    //   this.inquiryReport = '';
    //   this.emotions = [
    //     { name: 'Triste', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Embarrassé', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Frustré', valueBefore: "0", valueAfter: "0" },
    //     { name: 'En colère', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Coupable', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Esseulé', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Honteux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Inférieur', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Inadéquat', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Défectueux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Anxieux', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Déprimé', valueBefore: "0", valueAfter: "0" },
    //     { name: 'Désespéré', valueBefore: "0", valueAfter: "0" },
    //   ];
    // },
    stringToHTML(string){
      return string.replace(/\n/g, '<br>')
    },
  },
  mounted() {
    this.addScript('https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js');
  },
}
</script>
