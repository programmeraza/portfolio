import type ru from "./ru.json";

// Выводим тип словаря из ru.json — он используется как эталон структуры.
// Если добавляете новый ключ перевода, добавьте его во ВСЕ файлы
// (ru/en/uz/ja/zh/es), иначе TypeScript будет ругаться на остальные локали.
export type Dictionary = typeof ru;
