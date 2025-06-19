#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  Builder,
  menu::{Menu, MenuItem},
  tray::{TrayIconBuilder},
};
use tauri_plugin_autostart::{init as autostart_init, MacosLauncher};
// use tauri_plugin_updater::Builder as UpdaterBuilder;

fn main() {
  Builder::default()
    // === 1) Auto-launch at login ===
    .plugin(autostart_init(MacosLauncher::LaunchAgent, None))

    // === 2) In-app updater (configured in tauri.conf.json) ===
    //.plugin(UpdaterBuilder::new().build())

    // === 3) Register tray icon & menu ===
    .setup(|app| {
      // a) Create a “Quit” menu item
      let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

      // b) Bundle it into a Menu
      let menu = Menu::with_items(app, &[&quit])?;

      // c) Build the tray icon, attach menu & handler
      TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|_, event| {
          if event.id.as_ref() == "quit" {
            std::process::exit(0);
          }
        })
        .build(app)?;
      Ok(())
    })

    // === 4) Run with Wry runtime inferred by the `wry` feature ===
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
