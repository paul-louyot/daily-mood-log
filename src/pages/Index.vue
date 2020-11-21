<template>
  <Layout>
    <b-container>
      <b-row class="mb-3">
        <b-col md="12" class="d-flex justify-content-md-end justify-content-between">
          <span class="my-auto mr-md-3">
            <b-button
              variant="secondary"
              v-on:click="resetForm()"
              >
              Réinitialiser
            </b-button>
          </span>
          <span class="my-auto mr-md-3">
            <b-button
              variant="primary"
              v-on:click="fillWithMockupData()"
              >
              Simuler
            </b-button>
          </span>
          <span class="d-flex justify-content-center align-items-center">
            <locale-switcher></locale-switcher>
          </span>
        </b-col>
      </b-row>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Événement contrariant"
        >
          <b-form-textarea
            v-model="upsettingEvent"
            placeholder="Décrivez l'événement contrariant"
            rows="2"
            max-rows="6"
            ></b-form-textarea>
        </b-form-group>
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Émotions"
        >
          <b-row class="my-2 my-sm-3 justify-content-center" v-for="emotionsGroup in emotionsGroups" :key="emotionsGroup.name">
            <b-col cols="6" sm="3">
              <span v-b-popover.hover.left="safeTranslation(`spread.${emotionsGroup.name}`)">{{ safeTranslation(emotionsGroup.name) | capitalize }}</span>
            </b-col>
            <b-col cols="2" sm="1" class="text-right">
              {{ emotionsGroup.levelBefore }}
            </b-col>
            <b-col cols="8" sm="8" class="mt-2 mt-sm-0">
              <b-form-input v-model="emotionsGroup.levelBefore" type="range" min="0" max="100" step="5" v-on:click="setFocus()"></b-form-input>
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
                {{ negativeThought.levelBefore }} %
              </b-col>
            <b-col cols="8" offset="2" offset-sm="0" sm="8">
              <b-form-input v-model="negativeThought.levelBefore" type="range" min="0" max="100" step="5" v-on:click="setFocus()"></b-form-input>
            </b-col>
            </b-row>
          </b-form-group>
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Recadrage positif"
        >
          <icon-base
            class="d-none d-sm-inline"
            icon-name="question-mark"
            v-b-popover.hover.right="$t(`explanation.positive_reframing`)">
            <question-mark />
          </icon-base>
          <div>
            <template v-for="positivelyReframable in positivelyReframables" >
              <b-row class="my-2" :key="positivelyReframable.name">
                <b-col sm="3" class="d-flex align-items-center">
                  <div>{{ $t(positivelyReframable.name) || `"${positivelyReframable.content}"` }}</div>
                </b-col>
                <b-col sm="9">
                  <b-form-input
                    v-model="positivelyReframable.advantages"
                    placeholder="Avantages, valeurs centrales"
                    ></b-form-input>
                </b-col>
              </b-row>
            </template>
          </div>
        </b-form-group>
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Objectif"
        >
          <b-row class="my-2 my-sm-3 justify-content-center" v-for="positivelyReframable in positivelyReframables" :key="positivelyReframable.name">
            <b-col cols="6" sm="3">
              <span v-b-popover.hover.left="safeTranslation(`spread.${positivelyReframable.name}`)">{{ safeTranslation(positivelyReframable.name) || `"${positivelyReframable.content}"` }}</span>
            </b-col>
            <b-col cols="2" sm="1" class="text-right">
              {{ positivelyReframable.levelGoal }}
            </b-col>
            <b-col cols="8" sm="8" class="mt-2 mt-sm-0">
              <b-form-input v-model="positivelyReframable.levelGoal" type="range" min="0" max="100" step="5" v-on:click="setFocus()"></b-form-input>
            </b-col>
          </b-row>
        </b-form-group>
      </div>

      <div class="p-4 mb-4 bg-light rounded-lg shadow">
        <b-form-group
          label="Identifiez la distorsion"
          >
          <b-form-checkbox-group v-model="negativeThought.distortions">
            <template v-for="distortion in distortions">
              <b-row v-bind:key="distortion.id">
                <b-col>
                  <b-form-checkbox
                    v-bind:value="distortion.name"
                  >
                    {{ distortion.name }}
                  </b-form-checkbox>
                  <icon-base
                    class="d-none d-sm-inline"
                    icon-name="question-mark"
                    v-b-popover.hover.right="$t(`distortions.${distortion.id}.definition`)">
                    <question-mark />
                  </icon-base>
                </b-col>
              </b-row>
            </template>
          </b-form-checkbox-group>
        </b-form-group>
      </div>
      <div v-if="hasFilledNegativeThought" class="p-4 mb-4 bg-light rounded-lg shadow">
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
          <div class="mb-2 d-sm-none">Décrivez maintenant les causes de ce problème</div>
          <b-row class="d-none d-sm-flex mb-2">
            <b-col sm="6" class="d-flex align-items-center">
              Causes de ce problème
            </b-col>
            <b-col sm="3" class="d-flex align-items-center justify-content-center">
              Importance
            </b-col>
            <b-col sm="2" class="d-flex align-items-center justify-content-center">
              <div class="text-center">Vous êtes responsable</div>
            </b-col>
          </b-row>
          <template v-for="(blame, index) in blameList">
            <b-row class="my-4 my-sm-2" v-bind:key="`blame-${index}`">
              <b-col cols="4" class="d-sm-none d-flex align-items-center">
                Cause&nbsp;:
              </b-col>
              <b-col cols="8" sm="6">
                <b-form-input
                  v-model="blame.value"
                  >
                </b-form-input>
              </b-col>
              <b-col cols="5" class="d-sm-none d-flex align-items-center mt-2 mt-sm-0">
                Force : {{ blame.strength }}
              </b-col>
              <b-col cols="7" sm="3" class="d-flex align-items-center justify-content-center mt-2 mt-sm-0">
                <b-form-input v-model="blame.strength" type="range" min="0" max="5" step="1" v-on:click="setFocus()"></b-form-input>
              </b-col>
              <b-col cols="7" class="d-sm-none d-flex align-items-center mt-2 mt-sm-0">
                Responsable ?
              </b-col>
              <b-col cols="5" sm="2" class="d-flex align-items-center justify-content-end justify-content-sm-center mt-2 mt-sm-0">
                <b-form-checkbox v-model="blame.isLegit" value="true" switch></b-form-checkbox>
              </b-col>
              <b-col cols="5" sm="1" class="d-none d-sm-flex align-items-center justify-content-end justify-content-sm-center mt-2 mt-sm-0">
                <button type="button" class="close" aria-label="Close" v-on:click="deleteBlame(index)">
                  <span aria-hidden="true">&times;</span>
                </button>
              </b-col>
            </b-row>
          </template>
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
        label="Re-notez votre degré de croyance dans votre pensée négative"
        >
          <b-row class="my-2" v-if="hasFilledNegativeThought">
            <b-col cols="12">
              Pensée négative :
            </b-col>
            <b-col cols="12">
              "{{ negativeThought.content }}"
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col cols="8" offset="2" offset-sm="0" sm="4">
              {{ negativeThought.levelAfter }} %
            </b-col>
          <b-col cols="8" offset="2" offset-sm="0" sm="8">
            <b-form-input
              v-model="negativeThought.levelAfter"
              v-bind:disabled="negativeThought.levelBefore == 0"
              type="range"
              min="0"
              max="100"
              step="5"
              v-on:click="setFocus()"
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
                <b-form-input v-model="voidModel" type="range" min="0" max="100" step="5" disabled>
                </b-form-input>
              </b-col>
            </b-row>
          </template>
          <template v-else>
            <template v-for="emotionsGroup in nonVoidEmotionsGroups" >
              <b-row class="my-1" :key="emotionsGroup.name">
                <b-col cols="8" offset="2" offset-sm="0" sm="4">
                  <div class="d-flex justify-content-between">
                    <div>{{ $t(emotionsGroup.name) }} :</div>
                    <div>{{ emotionsGroup.levelAfter }}</div>
                  </div>
                </b-col>
                <b-col cols="8" offset="2" offset-sm="0">
                  <b-form-input v-model="emotionsGroup.levelAfter" type="range" min="0" max="100" step="5" v-on:click="setFocus()"></b-form-input>
                </b-col>
              </b-row>
            </template>
          </template>
        </b-form-group>
      </div>

      <div class="d-flex align-items-center justify-content-center mt-4 mb-4">
        <b-button
          variant="primary"
          v-on:click="downloadPDF()"
        >
          Télécharger le compte-rendu (PDF)
        </b-button>
      </div>

      <div class="border border-primary rounded-lg shadow mb-5">
        <div class="p-4" ref="report">
          <div class="mb-3 text-center">
            <b>Compte-rendu du {{ frenchDate }}</b>
          </div>
          <div class="mb-3">
            <div>
              <b>Événement contrariant :</b>
            </div>
            <div>
              {{ upsettingEvent }}
            </div>
          </div>
          <div class="mb-3">
            <table class="table table-responsive table-striped" v-if="someEmotionsFilled">
              <thead>
                <tr class="table-primary">
                  <th>
                    Émotions
                  </th>
                  <th class="text-center">
                    Avant&nbsp;(%)
                  </th>
                  <th class="text-center">
                    Objectif&nbsp;(%)
                  </th>
                  <th class="text-center">
                    Après&nbsp;(%)
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="emotionsGroup in nonVoidEmotionsGroups">
                  <tr v-bind:key="emotionsGroup.name">
                    <td>
                      {{ $t(emotionsGroup.name) }}
                    </td>
                    <td class="text-center">
                      {{ emotionsGroup.levelBefore }}
                    </td>
                    <td class="text-center">
                      {{ emotionsGroup.levelGoal }}
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
            <table class="table table-responsive table-striped" v-if="someEmotionsFilled">
              <thead>
                <tr class="table-primary">
                  <th>
                    Pensées négatives
                  </th>
                  <th class="text-center">
                    Avant&nbsp;(%)
                  </th>
                  <th class="text-center">
                    Objectif&nbsp;(%)
                  </th>
                  <th class="text-center">
                    Après&nbsp;(%)
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
                      {{ negativeThought.levelBefore }}
                    </td>
                    <td class="text-center">
                      {{ negativeThought.levelGoal }}
                    </td>
                    <td class="text-center">
                      {{ negativeThought.levelAfter }}
                    </td>
                    <td>
                      <ul>
                        <template v-for="distortion in negativeThought.distortions">
                          <li v-bind:key="distortion">
                          {{ distortion }}
                          </li>
                        </template>
                      </ul>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mb-3">
            <b>Recadrage positif :</b>
            <table class="table table-responsive table-striped" v-if="someEmotionsFilled">
              <thead>
                <tr class="table-primary">
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
                  <tr v-bind:key="emotionsGroup.name">
                    <td>
                      {{ $t(emotionsGroup.name) }}
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
import IconBase from '~/components/IconBase.vue'
import QuestionMark from '~/components/QuestionMark.vue'
import LocaleSwitcher from '~/components/LocaleSwitcher.vue'
export default {
  components: {
    PieChart,
    IconBase,
    QuestionMark,
    LocaleSwitcher
  },
  data() {
    return {
      emotionsGroups: [
        {
          name: "sad",
          emotions: "Triste, déprimé, malheureux",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "anxious",
          emotions: "Anxieux, inquiet, paniqué, nerveux, effrayé",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "guilty",
          emotions: "Coupable, honteux",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "worthless",
          emotions: "Inadéquat, défecteux, incompétent",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "lonely",
          emotions: "Seul, indésirable, rejeté",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "embarrassed",
          emotions: "Embarassé, bête, humilié, gêné",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "hopeless",
          emotions: "Désespéré, découragé, pessimiste",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "frustrated",
          emotions: "Frustré, coincé, abattu, démoralisé",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "angry",
          emotions: "En colère, furieux, amer, irrité, contrarié",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
        {
          name: "other",
          emotions: "Autre",
          levelBefore: 0,
          levelGoal: undefined,
          levelAfter: undefined,
          advantages: "",
        },
      ],
      negativeThought: {
        levelBefore: 0,
        levelGoal: undefined,
        levelAfter: undefined,
        advantages: "",
        distortions: [],
        content: "",
      },
      blameOrigin: '',
      blameList: [
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
        { value: '', strength: 1, isLegit: false },
      ],
      chartOptions: {
        animation: {
          duration: 0,
        },
        legend: {
          display: true
        }
      },
      upsettingEvent: '',
      voidModel: undefined,
      rationalResponse: '',
      inquiryReport: '',
      otherTechniqueReport: '',
      evidenceAgainst: '',
      evidenceInFavor: '',
      selectedDistortions: [],
      selectedTechnique: '',
      distortions: [
        {
          id: "all_or_nothing",
          name: 'Pensée en tout ou rien',
        },
        {
          id: 'overgeneralization',
          name: 'Généralisation à outrance',
        },
        {
          id: 'mental_filter',
          name: 'Filtre mental',
        },
        {
          id: 'discounting_positive',
          name: 'Rejet du positif',
        },
        {
          id: 'mind_reading',
          name: 'Lecture de pensée',
        },
        {
          id: 'fortune_telling',
          name: 'Erreur de prévision',
        },
        {
          id: 'magnification',
          name: 'Exagération ou minimisation',
        },
        {
          id: 'emotional_reasoning',
          name: 'Raisonnement émotif',
        },
        {
          id: 'should_statements',
          name: '"Je dois/devrais"',
        },
        {
          id: 'labeling',
          name: 'Erreur d\'étiquetage',
        },
        {
          id: 'blame',
          name: 'Personnalisation ou blâme',
        },
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
    dateArray(){
      var today = new Date();
      return [today.getFullYear(), (today.getMonth() + 1), today.getDate()]
    },
    englishDate(){
      return this.dateArray.join('-')
    },
    frenchDate(){
      return this.dateArray.slice().reverse().join('/')
    },
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
    somethingIsUpsetting(){
      return this.upsettingEvent.length > 0
    },
    canFillNegativeThought(){
      return this.somethingIsUpsetting && this.someEmotionsFilled;
    },
    hasFilledNegativeThought(){
      return this.negativeThought.levelBefore != 0 && this.negativeThought.content.length > 0;
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
    positivelyReframables(){
      if (this.hasFilledNegativeThought){
        return this.nonVoidEmotionsGroups.concat(this.negativeThought);
      } else {
        return this.nonVoidEmotionsGroups;
      }
    }
  },
  metaInfo: {
    title: 'Accueil'
  },

  methods: {
    // addData(){
    //   this.blameList.push({value: 'test', strength: 1});
    // },
    safeTranslation(key){
      if (key){
        return this.$t(key);
      }
      return "";
    },
    setFocus(){
      this.$el.focus();
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
    deleteBlame(index){
      this.blameList.splice(index, 1);
    },
    downloadPDF(){
      var fileName = "compte-rendu-" + this.englishDate + '.pdf';
      var element = this.$refs.report
      var opt = {
        filename: fileName,
      };

      html2pdf().set(opt).from(element).save();
    },
    fillWithMockupData(){
      this.upsettingEvent = 'J\'arrive en retard chez le médecin';
      this.negativeThought = {
        content: 'Le médecin va m\'en vouloir à mort',
        levelBefore: 100,
        levelAfter: 20,
        distortions: ['Lecture de pensée'],
      };
      this.selectedTechnique = 'rational_response';
      this.rationalResponse = 'Je peux faire de mon mieux pour être à l\'heure aux rdv, mais cela arrive d\'être en retard';
      this.emotionsGroups.forEach(x => {
        x.levelBefore = Math.floor(Math.random() * 20) * 5;
        x.levelGoal = undefined;
        x.levelAfter = undefined;
      });
    },
    resetForm(){
      this.upsettingEvent = '';
      this.negativeThought = {
        content: '',
        levelBefore: 0,
        levelAfter: undefined,
        distortions: [],
      };
      this.selectedTechnique = '';
      this.rationalResponse = '';
      this.emotionsGroups.forEach(x => {
        x.levelBefore = 0;
        x.levelGoal = undefined;
        x.levelAfter = undefined;
      });
    },
    stringToHTML(string){
      return string.replace(/\n/g, '<br>')
    },
  },

  mounted() {
    this.addScript('https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js');
  },

  filters: {
    capitalize(value){
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }

}
</script>
