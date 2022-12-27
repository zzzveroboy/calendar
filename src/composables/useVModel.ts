import { computed } from 'vue';

export const useVModel = <Props extends object, Key extends keyof Props, EventType extends string>(
  props: Props,
  key: Key,
  emit: (e: EventType, ...args: any[]) => void
) => {
  const model = computed<Props[Key]>({
    get() {
      return props[key];
    },
    set(v) {
      //@ts-expect-error
      emit(`update:${key}`, v);
    }
  });
  return model;
};
