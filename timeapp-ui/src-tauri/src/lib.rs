use tauri::{Builder, Wry};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // start with a Builder
    let mut builder: Builder<Wry> = Builder::default();

  // in debug builds, wire up the log plugin
  if cfg!(debug_assertions) {
    builder = builder.plugin(
      tauri_plugin_log::Builder::default()
        .level(log::LevelFilter::Info)
        .build(),
    );
  }

  // now finish building and run
  builder
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
