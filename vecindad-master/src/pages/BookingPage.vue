<template>
  <div id="social">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-toolbar card dense color="transparent">
          <v-toolbar-title><h4>Mis Reservaciones</h4></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn small color="primary" @click="onEventAdd()"
            >Agregar Reserva</v-btn
          >
        </v-toolbar>
        <template v-if="!loading">
          <div class="text-xs-center">
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <v-flex sm12 lg3 class="pa-3 mb-3 feature-pane elevation-1">
            <v-btn
              fab
              outline
              small
              absolute
              left
              color="primary"
              @click="$refs.calendarBooking.prev()"
            >
              <v-icon dark>
                keyboard_arrow_left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              outline
              small
              absolute
              right
              color="primary"
              @click="$refs.calendarBooking.next()"
            >
              <v-icon dark>
                keyboard_arrow_right
              </v-icon>
            </v-btn>
            <v-container grid-list-xl fluid class="px-0 pt-5">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select
                    v-model="selectedArea"
                    :items="areas"
                    item-text="name"
                    item-value="id"
                    label="Área comun"
                    placeholder="Seleccione un área"
                    hide-details
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    ref="startMenu"
                    v-model="startMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="dateStart"
                    transition="scale-transition"
                    min-width="290px"
                    lazy
                    offset-y
                    full-width
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateStart"
                        class="mt-0"
                        label="Fecha de inicio"
                        palceholder="Seleccione una fecha"
                        prepend-icon="event"
                        hide-details
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dateStart" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="startMenu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        flat
                        color="primary"
                        @click="$refs.startMenu.save(dateStart)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    ref="pickerEnd"
                    v-model="showPickerEnd"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="dateEnd"
                    transition="scale-transition"
                    min-width="290px"
                    lazy
                    offset-y
                    full-width
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateEnd"
                        class="mt-0"
                        label="Fecha de fin"
                        palceholder="Seleccione una fecha"
                        prepend-icon="event"
                        readonly
                        hide-details
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dateEnd" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        color="primary"
                        @click="showPickerEnd = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        flat
                        color="primary"
                        @click="$refs.pickerEnd.save(dateEnd)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex sm12 lg9 class="pl-3 pt-0">
            <v-sheet height="500" class="elevation-1">
              <v-calendar
                ref="calendarBooking"
                v-model="dateStart"
                locale="es"
                :value="today"
                type="month"
                :now="today"
              >
                <template v-slot:day="{ date }">
                  <template v-for="event in eventsMap[date]">
                    <v-menu
                      :key="event.title"
                      v-model="event.open"
                      full-width
                      offset-x
                    >
                      <template v-slot:activator="{ on }">
                        <div
                          v-if="!event.time"
                          v-ripple
                          class="my-event"
                          v-on="on"
                        >
                          {{ event.title }}
                        </div>
                      </template>
                      <v-card color="grey lighten-4" min-width="350px" flat>
                        <v-toolbar color="primary" dark>
                          <v-toolbar-title>{{ event.title }}</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn icon>
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-card-title primary-title>
                          <span>{{ event.details }}</span>
                        </v-card-title>
                        <v-card-actions>
                          <v-btn flat color="secondary">
                            Cerrar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </template>
                </template>
                <!-- <template v-slot:day="day">
                  <template v-if="day.day % 3 === 0">
                    <v-sheet class="white--text pa-1">
                      day slot {{ day.date }}
                    </v-sheet>
                  </template>
                </template>
                <template v-slot:header="day">
                  <template v-if="day.weekday % 2">
                    <div class="day-header">
                      day-header slot {{ day.date }}
                    </div>
                  </template>
                </template>
                <template v-slot:day-body="day">
                  <template v-if="day.weekday % 3 === 2">
                    <div class="day-body">day-body slot {{ day.date }}</div>
                  </template>
                </template> -->
              </v-calendar>
            </v-sheet>
          </v-flex>
        </template>
      </v-layout>
    </v-container>

    <v-dialog v-model="dialogAdd" persistent max-width="600px">
      <booking-form @close="dialogAdd = false" @submit="dialogAdd = false" />
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="600px">
      <v-card v-if="dialogDetail">
        <v-card-title>
          <span class="subheading">{{ selectedItem.guests[0].name }}</span>
        </v-card-title>
        <v-card-text>
          <v-list two-line class="pa-0">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">assignment_ind</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{
                  selectedItem.guests[0].dni
                }}</v-list-tile-title>
                <v-list-tile-sub-title>DNI</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-action>
                <v-icon color="indigo">date_range</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{
                  selectedItem.invitation_date.split(" ")[0]
                }}</v-list-tile-title>
                <v-list-tile-sub-title>Fecha de llegada</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialogDetail = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="450px">
      <v-card v-if="dialogDelete">
        <v-card-title>
          <span class="subheading">Eliminar Invitado</span>
        </v-card-title>
        <v-card-text>
          <div>
            ¿Estás seguro que deseas eliminar a {{ selectedItem.name }}?
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialogDelete = false">No</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogDelete = false"
            >Sí</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import BookingForm from "@/components/booking/BookingForm";
const weekdaysDefault = [0, 1, 2, 3, 4, 5, 6];
const intervalsDefault = {
  first: 0,
  minutes: 60,
  count: 24,
  height: 40
};
const stylings = {
  default() {
    return undefined;
  },
  workday(interval) {
    const inactive =
      interval.weekday === 0 ||
      interval.weekday === 6 ||
      interval.hour < 9 ||
      interval.hour >= 17;
    const startOfHour = interval.minute === 0;
    const dark = this.dark;
    const mid = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    return {
      backgroundColor: inactive
        ? dark
          ? "rgba(0,0,0,0.4)"
          : "rgba(0,0,0,0.05)"
        : undefined,
      borderTop: startOfHour ? undefined : "1px dashed " + mid
    };
  },
  past(interval) {
    return {
      backgroundColor: interval.past
        ? this.dark
          ? "rgba(0,0,0,0.4)"
          : "rgba(0,0,0,0.05)"
        : undefined
    };
  }
};

export default {
  name: "BookingPage",
  components: {
    BookingForm
  },
  data() {
    return {
      dateEnd: "2019-01-27",
      dateStart: "2019-01-12",
      startMenu: false,
      showPickerEnd: false,
      scrollSettings: {
        maxScrollbarLength: 160
      },
      type: "month",
      minWeeks: 1,
      nowMenu: false,
      now: null,
      maxDays: 7,
      today: "2019-01-08",
      events: [
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2018-12-30",
          open: false
        },
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2019-01-01",
          open: false
        },
        {
          title: "Vacation",
          details: "Going to the beach!",
          date: "2019-01-01",
          open: false
        },
        {
          title: "Meeting",
          details: "Spending time on how we do not have enough time",
          date: "2019-01-07",
          open: false
        },
        {
          title: "30th Birthday",
          details: "Celebrate responsibly",
          date: "2019-01-03",
          open: false
        },
        {
          title: "New Year",
          details: "Eat chocolate until you pass out",
          date: "2019-01-01",
          open: false
        },
        {
          title: "Conference",
          details:
            "Mute myself the whole time and wonder why I am on this call",
          date: "2019-01-21",
          open: false
        },
        {
          title: "Hackathon",
          details: "Code like there is no tommorrow",
          date: "2019-02-01",
          open: false
        }
      ],
      intervals: intervalsDefault,
      weekdays: weekdaysDefault,
      styleInterval: "default",
      selectedArea: null,
      searchInvitation: null,
      dialogDelete: false,
      dialogDetail: false,
      dialogAdd: false,
      selectedItem: {},
      headers: [
        { text: "Nombre y Apellido", align: "left" },
        { text: "DNI" },
        { text: "Fecha de llegada" },
        { text: "Action" }
      ]
    };
  },
  computed: {
    ...mapState({
      areas: state => state.areas.items,
      loading: state => state.invitations.loading,
      invitations: state => state.invitations.items
    }),
    eventsMap() {
      const map = {};
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e));
      return map;
    },
    intervalStyle() {
      return stylings[this.styleInterval].bind(this);
    },
    hasIntervals() {
      return (
        this.type in
        {
          week: 1,
          day: 1,
          "4day": 1,
          "custom-daily": 1
        }
      );
    }
  },
  async mounted() {
    await this.fetchAreas();
    console.log("invitations", this.invitations);
  },
  methods: {
    ...mapActions(["fetchAreas"]),
    open(event) {
      alert(event.title);
    },
    showIntervalLabel(interval) {
      return interval.minute === 0;
    },
    onEventAdd() {
      this.dialogAdd = true;
    },
    openDialogDelete(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },
    openDialogDetail(item) {
      this.selectedItem = item;
      this.dialogDetail = true;
    },
    onSearch() {
      if (!this.searchInvitation) return;
      console.log("search!", this.searchInvitation);
    }
  }
};
</script>
<style scoped lang="scss">
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
.feature-pane {
  position: relative;
  padding-top: 30px;
  background-color: #fff;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
/*
.day-header {
  margin: 0px 2px 2px 2px;
  padding: 2px 6px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  border-radius: 2px;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.day-body {
  position: absolute;
  top: 400px;
  height: 36px;
  margin: 2px;
  padding: 2px 6px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  border-radius: 2px;
  left: 0;
  right: 0;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.day {
  position: relative;
  height: 24px;
  margin: 0px;
  padding: 0px 6px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  border-radius: 2px;
  left: 0;
  right: 0;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
*/
</style>
