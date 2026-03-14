import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { BlankLayoutComponent } from './core/layouts/blank-layout/blank-layout.component';
import { MessagesComponent } from './features/messages/messages.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PublicSendMessageComponent } from './features/public-send-message/public-send-message.component'
import { authGuard } from './core/guards/auth.guard';
import { isloggedGuard } from './core/guards/islogged.guard';
import { OneMessageComponent } from './features/one-message/one-message.component';

export const routes: Routes = [

    { path: '', redirectTo: 'messages', pathMatch: 'full' },
    {
        path: '', component: AuthLayoutComponent, canActivate: [isloggedGuard], children: [
            { path: 'login', component: LoginComponent, title: 'login page' },
            { path: 'register', component: RegisterComponent, title: 'register page' }
        ]
    },

    {
        path: '', component: BlankLayoutComponent, canActivate: [authGuard], children: [
            { path: 'messages', component: MessagesComponent, title: 'messages' },
            { path: 'oneMesssage/:msgId', component: OneMessageComponent, title: 'One Message' },
            { path: 'settings', component: SettingsComponent, title: 'settings' },
        ]
    }
    ,
    { path: 'public_message/:id', component: PublicSendMessageComponent, title: 'send message' }
    ,
    { path: '**', component: NotFoundComponent, title: 'notFound' }

];
