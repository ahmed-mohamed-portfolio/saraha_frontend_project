import { Component, inject, input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { MessageService } from '../../../core/services/api/message.service';


@Component({
  selector: 'app-create-message',
  imports: [FormsModule, InputTextModule, Dialog, ButtonModule, TextareaModule, ReactiveFormsModule],
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.scss',
})
export class CreateMessageComponent {

  constructor(private flowbiteService: FlowbiteService) { }

  private readonly messageService = inject(MessageService)

  saveFile: WritableSignal<File | null> = signal(null)

  contents: FormControl = new FormControl(null, [Validators.required])

  visible: WritableSignal<boolean> = signal(false);

  value: string = "";

  value2!: string;

  url: WritableSignal<string | null> = signal(null);

  newPost = output<boolean>();

  inProfile = input<boolean>(false);

  id: string = "69b015d011d51ca445155e8a"

  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });


  }


  showDialog() {
    this.visible.set(true)
  }


  changeImage(e: Event): void {

    let input = e.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      this.saveFile.set(input.files[0])


      // https://www.youtube.com/watch?v=Z5Yf0xJVXYI
      const reader = new FileReader()
      reader.readAsDataURL(input.files[0])
      reader.onload = (event: any) => {
        this.url.set(event.target.result)
      }

    }

  }


  removeImg() {

    this.url.set(null)
    this.saveFile.set(null)

  }


  submitForm(e: Event): void {

    if (this.contents.valid) {

      const formData = new FormData()

      formData.append('body', this.contents.value)

      let file = this.saveFile()

      if (file) {
        formData.append('image', file, file.name)
      }


      this.sendMessage(this.contents.value, this.id);


    }

  }


  //http://localhost:4200/public_message/69b015d011d51ca445155e8a

  sendMessage(formData: any, receverId: string) {


    this.messageService.sendMessage(formData, receverId).subscribe({
      next: (res) => {

        console.log(res);
        this.visible.set(false)
        this.newPost.emit(true);

        this.contents.reset();
        this.saveFile.set(null);
        this.url.set(null);

      },
      error: (err) => {
        console.log(err);
      }
    })


  }



}
