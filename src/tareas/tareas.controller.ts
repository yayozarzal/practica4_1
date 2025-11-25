import { Controller, Get, Post, Body } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() dto: CreateTareaDto) {
    return this.tareasService.create(dto);
  }

  @Get()
  findAll() {
    return this.tareasService.findAll();
  }
}
