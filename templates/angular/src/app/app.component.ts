import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
        <div class="app">
            <h1>Welcome to your app</h1>
            <p>Edit <code>src/app/app.component.ts</code> and save to reload.</p>
        </div>
    `,
    styles: [`
        .app {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }
    `],
})
export class AppComponent {}
