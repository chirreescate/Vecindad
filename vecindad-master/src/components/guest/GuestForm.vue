<template>
  <v-card>
    <v-card-title>
      <span class="subheading">Agregar invitado</span>
    </v-card-title>
    <v-card-text>
      <v-container fluid grid-list-md class="px-0 py-0">
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              v-model="form.name"
              label="Nombre y Apellido*"
              placeholder="Ingrese su nombre"
              required
              hide-details
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="form.email"
              label="Correo electrónico"
              placeholder="Ingrese correo"
              required
              hide-details
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="form.dni"
              label="DNI*"
              placeholder="Ingrese DNI"
              required
              hide-details
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-checkbox
              v-model="form.regular_visitor"
              hide-details
              class="mt-0 pt-0"
              label="¿Es visitante regular?"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12>
            <v-container fluid grid-list-md class="px-0 py-0">
              <v-layout row wrap>
                <v-flex xs6>
                  <v-menu
                    ref="datePicker"
                    v-model="showDatePicker"
                    lazy
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    :return-value.sync="form.invitation_date"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.invitation_date"
                      label="Fecha de ingreso"
                      placeholder="Ingrese fecha"
                      prepend-icon="event"
                      :disabled="form.regular_visitor"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="form.invitation_date"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn flat @click="showDatePicker = false">Cancel</v-btn>
                      <v-btn
                        flat
                        color="primary"
                        @click="$refs.datePicker.save(form.invitation_date)"
                        >Aceptar</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-menu
                    ref="timePicker"
                    v-model="showTimePicker"
                    :close-on-content-click="true"
                    :nudge-right="40"
                    :return-value.sync="timePicker"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on2 }">
                      <v-text-field
                        v-model="timePicker"
                        label="Hora de ingreso"
                        placeholder="Seleccione una hora"
                        prepend-icon="access_time"
                        :disabled="form.regular_visitor"
                        readonly
                        v-on="on2"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="showTimePicker"
                      v-model="timePicker"
                      full-width
                      @click:minute="$refs.timePicker.save(timePicker)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="form.comment"
              label="Comentario"
              placeholder="Ingrese un comentario sobre el invitado"
            ></v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="$emit('close')">Cerrar</v-btn>
      <v-btn color="blue darken-1" flat @click="onSubmitInvitation"
        >Guardar</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { cloneDeep } from "lodash";
export default {
  name: "GuestForm",
  props: {
    type: {
      type: String,
      default: "new"
    },
    guest: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      showDatePicker: false,
      showTimePicker: false,
      timePicker: null,
      datePicker: null,
      form: {
        name: null,
        email: null,
        dni: null,
        check: false,
        event_id: null,
        regular_visitor: false,
        invitation_date: null,
        comment: null
      }
    };
  },
  watch: {
    guest(val) {
      if (val && this.type === "edit") {
        this.form = cloneDeep(this.guest);
      }
    }
  },
  created() {
    if (this.type) {
      this.form = cloneDeep(this.guest);
    }
  },
  methods: {
    onSubmitInvitation() {
      if (this.type === "edit") {
        this.$store.dispatch("editInvitation", this.form).then(() => {
          this.$emit("submit");
        });
      } else {
        this.$store.dispatch("createInvitation", this.form).then(() => {
          this.$emit("submit");
        });
      }
    }
  }
};
</script>
