package com.dailyreactnative;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by zsj on 2016/9/25.
 */

public class ReactWebViewManager extends SimpleViewManager<ObservableWebView> {

    public static final String REACT_CLASS = "RCTWebView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ObservableWebView createViewInstance(ThemedReactContext reactContext) {
        return new ObservableWebView(reactContext);
    }

    @ReactProp(name = "url")
    public void setUrl(final ObservableWebView webView, String url) {
        webView.loadUrl(url);
    }

    @ReactProp(name = "html")
    public void setHtml(final ObservableWebView webView, String html) {
        webView.loadData(html, "text/html; charset=utf-8", "UTF-8");
    }
}
