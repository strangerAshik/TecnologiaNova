@extends('layout.layout')
@section('content')

<div id="DNN7" class="Home">
    <div class="skinwidth">

        

      @include('component.header')
      @yield('header')

        <div id="Content">
        @include('component.rightSideBar')
        @yield('rightSideBar')

            <div class="contentWrapper">
            @include('component.slider')
            @yield('slider')
                <div class="clr"></div>

            @include('component.latest_news_and_video')
            @yield('latest_news_and_video')
                <div class="clr"></div>
            @include('component.photoGallery')
            @yield('photoGallery')
            @include('component.newsFeed')
            @yield('newsFeed')
</div>
                <div class="clr"></div>
            </div>
            <div class="clr"></div>
        </div>
            @include('component.footer')
            @yield('footer')

    </div>

@stop