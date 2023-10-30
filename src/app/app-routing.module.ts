import { inject, NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UserService } from "./core/services/user.service";
import { map } from "rxjs/operators";
import { ProfileComponent } from "./features/profile/profile.component";
import { TestListComponent } from "./features/test-list/test-list.component";

const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "test",
    loadComponent: () =>
      import("./features/test-list/test-list.component").then(
        (m) => m.TestListComponent
      ),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./login/login.component").then((m) => m.LoginComponent),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "register",
    loadComponent: () =>
      import("./register/register.component").then((m) => m.RegisterComponent),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: "settings",
    loadComponent: () =>
      import("./features/settings/settings.component").then(
        (m) => m.SettingsComponent
      ),
    canActivate: [() => inject(UserService).isAuthenticated],
  },
  {
    path: "profile",
    children: [
      {
        path: ":username",
        component: ProfileComponent,
        children: [
          {
            path: "",
            loadComponent: () =>
              import("./features/profile/profile-articles.component").then(
                (m) => m.ProfileArticlesComponent
              ),
          },
          {
            path: "favorites",
            loadComponent: () =>
              import("./features/profile/profile-favorites.component").then(
                (m) => m.ProfileFavoritesComponent
              ),
          },
        ],
      },
    ],
  },
  {
    path: "editor",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/editor/editor.component").then(
            (m) => m.EditorComponent
          ),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
      {
        path: ":slug",
        loadComponent: () =>
          import("./features/editor/editor.component").then(
            (m) => m.EditorComponent
          ),
        canActivate: [() => inject(UserService).isAuthenticated],
      },
    ],
  },
  {
    path: "articles/:slug",
    loadComponent: () =>
      import("./features/article/article.component").then(
        (m) => m.ArticleComponent
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
