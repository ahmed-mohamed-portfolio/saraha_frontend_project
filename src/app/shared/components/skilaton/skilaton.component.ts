import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-skilaton',
  imports: [],
  templateUrl: './skilaton.component.html',
  styleUrl: './skilaton.component.scss',
})
export class SkilatonComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) {
  }
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

  }
}
