export default interface ISaveableContentHandle {
  cancel: () => void;
  save: () => boolean;
  validate: () => boolean;
}
