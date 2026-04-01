import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  {
    path: 'oneMesssage/:msgId',
    renderMode: RenderMode.Server
  },
  {
    path: 'public_message/:profileName',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
