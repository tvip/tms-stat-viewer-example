import {AxiosResponse} from "axios";
import {VForm} from "vuetify/components/VForm";
import {Ref, WritableComputedRef} from "vue";
import IEntityDto from "@/model/IEntityDto";
import {ICrudService} from "@/service/ICrudService";

export async  function closeDialog(dialog: Ref<boolean>, emit: (event: "cancel" | "save" | "update:model", ...args: any[]) => void){
  emit('cancel');
  dialog.value = false;
}

export  async function  saveModel(form: Ref<VForm | undefined>, model: WritableComputedRef<IEntityDto>|Ref<IEntityDto>, crudService: ICrudService, emit: (event: "cancel" | "save" | "update:model", ...args: any[]) => void, dialog: Ref<boolean>){
  if(!form.value){
    return
  }
  const  valid  = await form.value.validate()

  if(valid.valid) {
    if (model.value.id == null) {
      crudService.create(model.value).then((response: AxiosResponse) => {
        if(response.status){
          emit('save');
          dialog.value = false;
        }
      })
    } else {
      crudService.update(model.value).then((response: AxiosResponse) => {
        if(response.status){
          emit('save');
          dialog.value = false;
        }
      })
    }
  }
}
