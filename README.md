Disclamer: The project as-is isn't really usable for now. The base functionality works, you can add projects, download the version of Godot you want to use it with and check the latest news articles from Godot. It hasn't been tested on any other platform than Linux. The reason I published it in such an early stage is to develop it in the open with the input of the community. In any case, more features will be added during the life time of the project and wider platform support.

# Godot Buddy

Godot Buddy is an all-in-one tool to help you manage Godot projects, engine versions, assets and comes with other tools to help you along your Godot journey. Think of it has the Unity Hub for Godot.

Why yet another Godot project manager? There are some good ones out there, my favourites being [Godots](https://github.com/MakovWait/godots) and [GodotEnv](https://github.com/chickensoft-games/GodotEnv). I just wanted to give it a shot, making a more featureful project manager than what already exists as well as showcasing the Tauri project.

## Download

This project is still in development, no downloads are available yet. If you wish to run it, you can pull the source and build it by yourself. See the Contribution -> Development section on how to run and build the project.

## Documentation

TODO: No docs yet, but it will come!

## Contributing

As the project is still in full development, contributions aren't welcome just yet but will be once the first version has been released. If you have any ideas or suggestions, feel free to open an issue.

### Development

In order to run this project, please follow the steps from [prerequisite page of the Tauri documentation](https://v2.tauri.app/start/prerequisites/). You can skip the "Mobile Targets" part as there are no plans to build this project for mobile devices.

Once all dependencies installed, the following commands are useful:

- Start the development build: `npm run tauri dev`
- Create the production builds: `npm run tauri build`
- Generate the TypeScript types: `npm run typegen`

### Documentation

TODO: Need docs first before writing on how to contribute to them. If you feel like taking on this part, please let me know under the issue #000.

### Translation

The project aims to be accessible for anyone in the community. Making it multilingual is key to this.
If you have a good understanding of English and wish to translate it into one of the languages supported by the Godot Engine, you are welcome to do so.
Languages that aren't included in Godot are currently not prioritized as we focus on reaching language party. Also, Right-to-Left languages such as Arabic or Hebrew are unsupported at the moment for technical reasons (the UI doesn't support it just now).

Ready to contribute? Head over to the `src/i18n` folder. This one contains JSON translation files with a 2 or 4 letters code. Take the English one (`en.json`), copy it and rename it to the target language (i.e. `de.json` or `pt_br.json`). You can now translate it to your language! ICU message formats are supported. Translations done with AI are accepted as long as you verify its quality. If your language already exists, you can review the existing translations and suggest better ones.

### Testing

Bugs happen. Simply using Godot Buddy and reporting issues is helpful to its development. If you wish to live a bit more on the edge and help development even more, try running pre-release builds. Or maybe play around dev builds!

Bugs are not the only thing we're after. If you spot inconsistencies, usability issues, or mistakes in translations, please file an issue and we'll address them in upcoming releases.

## Disclaimer

This project is not associated or endorsed in any way by the Godot Foundation, Godot Project or any other entity directly associated with that project. Godot Buddy an independent project that aims to make it easier to work on your project across multiple versions of the engine while also brining additional tools to make your development experience smoother.
