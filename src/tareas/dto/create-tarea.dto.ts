export class CreateTareaDto {
  titulo: string;
  descripcion?: string;
  fechaEntrega: string; // YYYY-MM-DD
  alumnoId: number;
  materiaId: number;
}
