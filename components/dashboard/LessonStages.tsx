import { Lesson1 } from "./lessons/Lesson1";
import { Lesson2 } from "./lessons/Lesson2";
import { Lesson3 } from "./lessons/Lesson3";
import { Lesson4 } from "./lessons/Lesson4";
import type { LessonStatus } from "@/lib/mock/aluno";

type Props = {
  lessonStatus: LessonStatus;
  lessonNumber: number;
};

export function LessonStages({ lessonStatus, lessonNumber }: Props) {
  switch (lessonNumber) {
    case 1:
      return <Lesson1 lessonStatus={lessonStatus} />;
    case 2:
      return <Lesson2 lessonStatus={lessonStatus} />;
    case 4:
      return <Lesson4 lessonStatus={lessonStatus} />;
    case 3:
    default:
      return <Lesson3 lessonStatus={lessonStatus} />;
  }
}
