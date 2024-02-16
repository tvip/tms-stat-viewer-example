import {computed, getCurrentInstance, WritableComputedRef} from "vue";

export function useModelWrapper<T>(propName = "modelValue"):WritableComputedRef<T> {
  const instance = getCurrentInstance();

  return computed({
    get: () => instance?.props[propName] as T,
    set: (value: T) => instance?.emit(`update:${propName}`, value),
  });
}
