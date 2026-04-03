import 'package:flutter/material.dart';
import 'pages/home_page.dart';

void main() {
    runApp(const MyApp());
}

class MyApp extends StatelessWidget {
    const MyApp({super.key});

    @override
    Widget build(BuildContext context) {
        return MaterialApp(
            title: 'Grimox Flutter',
            theme: ThemeData(
                colorSchemeSeed: Colors.blue,
                useMaterial3: true,
            ),
            home: const HomePage(),
        );
    }
}
