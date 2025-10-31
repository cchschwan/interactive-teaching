-- CreateTable
CREATE TABLE "students" (
    "student_id" SERIAL NOT NULL,
    "qr_code_identifier" VARCHAR(50) NOT NULL,
    "class_name" VARCHAR(100),
    "date_created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "exercise_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "question_json" JSONB NOT NULL,
    "solution_json" JSONB NOT NULL,
    "topic" VARCHAR(100) NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("exercise_id")
);

-- CreateTable
CREATE TABLE "results" (
    "result_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "submitted_answer_json" JSONB NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "feedback_text" TEXT,
    "submission_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_seconds" INTEGER NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("result_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_qr_code_identifier_key" ON "students"("qr_code_identifier");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("exercise_id") ON DELETE RESTRICT ON UPDATE CASCADE;
