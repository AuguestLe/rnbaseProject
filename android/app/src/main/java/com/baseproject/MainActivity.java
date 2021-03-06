package com.baseproject;

import android.graphics.Color;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BaseProject";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this);
        getReactNativeHost().getReactInstanceManager().addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
          @Override
          public void onReactContextInitialized(ReactContext context) {
              runOnUiThread(new Runnable() {
                  @Override
                  public void run() {
                      getWindow().getDecorView().setBackgroundColor(Color.WHITE);
                  }
              });
          }
      });
      super.onCreate(savedInstanceState);
  }
}
