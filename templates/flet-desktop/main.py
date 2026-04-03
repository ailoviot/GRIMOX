import flet as ft


def main(page: ft.Page):
    page.title = "My App"
    page.window.width = 900
    page.window.height = 600
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER

    counter = ft.Text("0", size=48, weight=ft.FontWeight.BOLD)

    def increment(e):
        counter.value = str(int(counter.value) + 1)
        page.update()

    def decrement(e):
        counter.value = str(int(counter.value) - 1)
        page.update()

    page.add(
        ft.Column(
            [
                ft.Text("Welcome to your app", size=24, weight=ft.FontWeight.BOLD),
                ft.Container(height=20),
                counter,
                ft.Row(
                    [
                        ft.ElevatedButton("Decrement", on_click=decrement),
                        ft.ElevatedButton("Increment", on_click=increment),
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                ),
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        ),
    )


ft.app(target=main)
