import { Notify } from 'quasar';
import type { QNotifyCreateOptions } from 'quasar';

export function notify(
  type: QNotifyCreateOptions['type'],
  message: string,
  options: Partial<QNotifyCreateOptions> = {},
) {
  // @ts-expect-error: Ignorando erro de tipo por causa de uma falha temporária na validação do tipo
  const notifyOptions: QNotifyCreateOptions = {
    type,
    message,
    group: true,
    position: 'top-right',
    progress: true,
    timeout: 5000,
    actions: [{ icon: 'close', color: 'white', round: true }],
    ...options,
  };

  Notify.create(notifyOptions);
}
