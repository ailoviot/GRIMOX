import flet as ft


def main(page: ft.Page):
    page.title = "My App"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER

    page.add(
        ft.Text("Welcome to your app", size=24, weight=ft.FontWeight.BOLD),
    )


ft.app(target=main)
