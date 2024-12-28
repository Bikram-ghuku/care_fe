import {
  BedSingle,
  CircleCheck,
  CircleDashed,
  Clock,
  Droplet,
} from "lucide-react";
import { Link } from "raviger";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

import { Avatar } from "@/components/Common/Avatar";

import { PLUGIN_Component } from "@/PluginEngine";
import { formatDateTime, formatPatientAge } from "@/Utils/utils";
import { Encounter, completedEncounterStatus } from "@/types/emr/encounter";
import { Patient } from "@/types/emr/newPatient";

import { Button } from "../ui/button";

export interface PatientInfoCardProps {
  patient: Patient;
  encounter: Encounter;
  fetchPatientData?: (state: { aborted: boolean }) => void;
}

export default function PatientInfoCard(props: PatientInfoCardProps) {
  const { patient, encounter } = props;
  const { t } = useTranslation();
  return (
    <>
      <section className="flex flex-col lg:flex-row">
        <div
          className="flex w-full flex-col bg-white px-4 pt-2 lg:flex-row"
          id="patient-infobadges"
        >
          <div className="flex justify-evenly lg:justify-normal">
            <div className="flex flex-col items-start lg:items-center">
              <div className="w-24 min-w-20 bg-secondary-200 h-24">
                <Avatar name={patient.name} className="w-full h-full" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div
                className="mb-2 flex flex-col justify-center text-xl font-semibold capitalize lg:hidden"
                id="patient-name-consultation"
              >
                {patient.name}
                <div className="ml-3 mr-2 mt-[6px] text-sm font-semibold text-secondary-600">
                  {formatPatientAge(patient, true)} • {patient.gender}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 space-y-2 lg:items-start lg:gap-0 lg:pl-2">
            <div className="flex flex-col flex-wrap items-center justify-center lg:items-start lg:justify-normal">
              <div
                className="hidden flex-row text-xl font-semibold capitalize lg:flex"
                id="patient-name-consultation"
              >
                {patient.name}
                <div className="ml-3 mr-2 mt-[6px] text-sm font-semibold text-secondary-600">
                  {formatPatientAge(patient, true)} • {patient.gender}
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    Start Date
                  </span>
                  <span className="text-xs">
                    {props.encounter.period.start
                      ? formatDateTime(props.encounter.period.start)
                      : "Not started"}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">
                    End Date
                  </span>
                  <span className="text-xs">
                    {props.encounter.period.end
                      ? formatDateTime(props.encounter.period.end)
                      : "Ongoing"}
                  </span>
                </div>
                {props.encounter.external_identifier && (
                  <div className="flex flex-col space-y-1 col-span-2">
                    <span className="text-sm text-muted-foreground font-medium">
                      Hospital ID
                    </span>
                    <span className="text-sm">
                      {props.encounter.external_identifier}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:flex-row">
                <div
                  className="flex w-full flex-wrap items-center justify-center gap-2 text-sm text-secondary-900 sm:flex-row sm:text-sm md:pr-10 lg:justify-normal"
                  id="patient-consultationbadges"
                >
                  <Badge
                    className="capitalize gap-1 py-1 px-2"
                    variant="outline"
                    title={`Encounter Status: ${t(`encounter_status__${props.encounter.status}`)}`}
                  >
                    {completedEncounterStatus.includes(
                      props.encounter.status,
                    ) ? (
                      <CircleCheck
                        className="w-4 h-4 text-green-300"
                        fill="green"
                      />
                    ) : (
                      <CircleDashed className="w-4 h-4 text-yellow-500" />
                    )}
                    {t(`encounter_status__${props.encounter.status}`)}
                  </Badge>

                  <Badge
                    className="capitalize gap-1 py-1 px-2"
                    variant="outline"
                    title={`Encounter Class: ${props.encounter.encounter_class}`}
                  >
                    <BedSingle
                      className="w-4 h-4 text-blue-400"
                      fill="#93C5FD"
                    />
                    {t(`encounter_class__${props.encounter.encounter_class}`)}
                  </Badge>
                  <Badge
                    className="capitalize gap-1 py-1 px-2"
                    variant="outline"
                    title={`Priority: ${t(`encounter_priority__${props.encounter.priority}`)}`}
                  >
                    <Clock className="w-4 h-4 text-yellow-500" />
                    {t(`encounter_priority__${props.encounter.priority}`)}
                  </Badge>

                  {patient.blood_group && (
                    <Badge
                      className="capitalize gap-1 py-1 px-2"
                      variant="outline"
                      title={`Blood Group: ${patient.blood_group?.replace("_", " ")}`}
                    >
                      <Droplet className="w-4 h-4 text-red-300" fill="red" />
                      {patient.blood_group?.replace("_", " ")}
                    </Badge>
                  )}

                  {encounter.hospitalization?.discharge_disposition && (
                    <Badge title="Discharge Disposition" variant="outline">
                      {encounter.hospitalization.discharge_disposition}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-end gap-4 px-4 py-1 2xl:flex-row"
          id="consultation-buttons"
        >
          {!completedEncounterStatus.includes(encounter.status) && (
            <div className="flex w-full flex-col gap-3 lg:w-auto 2xl:flex-row">
              <Button asChild variant="primary">
                <Link
                  href={`/patient/${patient.id}/encounter/${encounter.id}/updates`}
                >
                  Update Encounter
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <PLUGIN_Component __name="ExtendPatientInfoCard" {...props} />
    </>
  );
}
