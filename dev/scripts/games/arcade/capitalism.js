(function() {
    "use strict";

    var animation;
    var time = 0;
    var lastTime = 0;
    var deltaTime = 0;
    var money = 0;
    var lifetimeEarnings = 0;
    var newAngels = 0;
    var savedAngels = 0;
    var angelsBonus = 2;
    var frameCount = 0;
    var storage = window.localStorage;
    var totalAcheivements = 629;
    var availablePurchaseOptions = [1, 10, 100, 'Max'];
    var currentPurchaseOption = availablePurchaseOptions[0];
    var incrementElements = document.querySelectorAll('.capitalism-buy-increment');
    var changeBuyIncrementButton = document.getElementById('changeBuyIncrementButton');
    var menus = document.querySelectorAll('capitalism-menu');
    var openMenuButtons = document.querySelectorAll('.capitalism-open-menu-button');
    var closeMenuButtons = document.querySelectorAll('.capitalism-close-menu-button');
    var buyManagerButtons = document.querySelectorAll('.capitalism-buy-manager-button');
    var upgradeElements = document.querySelectorAll('[id^=upgradeWrapper]');
    var unlockNotice = document.getElementById('capitalismUnlockNotice');
    var unlockNoticeImage = document.getElementById('capitalismUnlockImage');
    var unlockNoticeText = document.getElementById('capitalismUnlockText');
    var savedAngelsElement = document.getElementById('savedAngels');
    var angelsBonusElement = document.getElementById('angelsBonus');
    var newAngelsElement = document.getElementById('newAngels');
    var claimAngelButton = document.getElementById('claimAngelButton');
    var rotateScreen = document.getElementById('capitalismRotateScreen');
    var baseSpeed = 1;
    var imageBasePath = '/images/games/arcade/capitalism/';
    var unlockMessageTimer = {
        isRunning: false,
        time: 0,
        displayTime: 3
    };
    var allCompaniesPurchased = false;
    var progressInnerBarIncrement = 1;
    var oneFifthCanvasWidth = 0;
    var playButton = document.getElementById('capitalismPlayButton');
    // a = applies to, c = cost, m = multiplier
       var upgrades = [
           {c: 250, a: 'lemon', m:3}, {c:500, a: 'news', m: 3}, {c:1000 , a:'carwash', m:3}, {c:5000 , a:'pizza', m:3}, {c:10000000, a:'donut', m:3},
           {c:25000000, a:'shrimp', m:3}, {c:500000000, a:'hockey', m:3}, {c:1e+10, a:'studio', m:3}, {c:5e+10 , a:'bank', m:3}, {c:2.5e+11, a:'oil', m:3},
           {c:2e+13, a:'lemon', m:3}, {c:5e+13, a:'news', m:3}, {c:1e+14, a:'carwash', m:3}, {c:5e+14, a:'pizza', m:3}, {c:1e+15, a:'donut', m:3},
           {c:2e+15, a:'shrimp', m:3}, {c:5e+15, a:'hockey', m:3}, {c:5e+15, a:'hockey', m:3}, {c:1e+16, a:'bank', m:3}, {c:2e+16, a:'oil', m:3},{c:5e+16, a:'all', m:3},
           {c:1e+17, a:'angel', m:1}, {c:2e+18, a:'lemon', m:3}, {c:2e+18, a:'lemon', m:3},{c:5e+18, a:'news', m:3}, {c:7e+18, a:'carwash', m:3}, {c:1e+19, a:'pizza', m:3},
           {c:3.5e+19, a:'shrimp', m:3}, {c:5e+19, a:'hockey', m:3}, {c:7.5e+19, a:'studio', m:3}, {c:1e+20, a:'bank', m:3}, {c:2e+20, a:'oil', m:3},
           {c:5e+20, a:'all', m:3}, {c:1e+21, a:'angel', m:1}, {c:2.5e+22, a:'lemon', m:3}, {c:5e+22, a:'news', m:3}, {c:1e+23, a:'carwash', m:3},
           {c:2e+23, a:'pizza', m:3}, {c:3e+23, a:'donut', m:3}, {c:4e+23, a:'shrimp', m:3}, {c:5e+23, a:'hockey', m:3}, {c:6e+23, a:'studio', m:3},
           {c:7e+23, a:'bank', m:3}, {c:8e+23, a:'oil', m:3}, {c:9e+23, a:'all', m:3}, {c:1e+25, a:'angel', m:3}, {c:1e+27, a:'lemon', m:3},
           {c:2.5e+28, a:'carwash', m:3}, {c:1e+29, a:'pizza', m:3}, {c:2.5e+29, a:'donut', m:3}, {c:5e+29, a:'shrimp', m:3}, {c:1e+30, a:'hockey', m:3},
           {c:5e+30, a:'studio', m:3}, {c:2.5e+31, a:'bank', m:3}, {c:5e+31, a:'oil', m:3}, {c:1e+33, a:'all', m:3}, {c:5e+33, a:'news', m:3}, {c:2.5e+34, a:'carwash', m:3},
           {c:5e+34, a:'pizza', m:3}, {c:1e+35, a:'donut', m:3}, {c:2.5e+35, a:'shrimp', m:3}, {c:5e+35, a:'hockey', m:3},
           {c:1e+36, a:'studio', m:3}, {c:5e+36, a:'bank', m:3}, {c:1e+37, a:'oil', m:3}, {c:25e+39, a:'lemon', m:3}, {c:100e+39, a:'all', m:3},
           {c:250e+39, a:'news', m:3}, {c:500e+39, a:'carwash', m:3}, {c:750e+39, a:'pizza', m:3}, {c:1e+42, a:'donut', m:3}, {c:5e+42, a:'shrimp', m:3},
           {c:15e+42, a:'hockey', m:3}, {c:50e+42, a:'studio', m:3}, {c:100e+42, a:'bank', m:3}, {c:250e+42, a:'oil', m:3}, {c:500e+42, a:'lemon', m:3},
           {c:1e+48, a:'all', m:7}, {c:1e+51, a:'all', m:5}, {c:1e+54, a:'all', m:7}, {c:10e+54, a:'news', m:3}, {c:100e+54, a:'carwash', m:3},
           {c:1e+57, a:'all', m:9}, {c:10e+57, a:'pizza', m:3}, {c:100e+57, a:'donut', m:3}, {c:1e+63, a:'all', m:11}, {c:10e+63, a:'shrimp', m:3},
           {c:100e+63, a:'hockey', m:3}, {c:1e+66, a:'all', m:13}, {c:10e+66, a:'studio', m:3}, {c:100e+66, a:'bank', m:3}, {c:1e+69, a:'all', m:15},
           {c:10e+69, a:'oil', m:3}, {c:100e+69, a:'lemon', m:3}, {c:1e+75, a:'all', m:3}, {c:3e+78, a:'all', m:3.1415926}, {c:1e+78, a:'news', m:3},
           {c:5e+78, a:'carwash', m:3}, {c:25e+78, a:'pizza', m:3}, {c:50e+78, a:'donut', m:3}, {c:100e+78, a:'shrimp', m:3}, {c:250e+78, a:'hockey', m:3},
           {c:500e+78, a:'studio', m:3}, {c:1e+81, a:'bank', m:3}, {c:5e+81, a:'oil', m:3}, {c:10e+81, a:'lemon', m:3}, {c:500e+81, a:'all', m:2},
           {c:2e+84, a:'news', m:2}, {c:11e+84, a:'carwash', m:2}, {c:66e+84, a:'pizza', m:2}, {c:230e+84, a:'donut', m:2}, {c:400e+84, a:'shrimp', m:2},
           {c:700e+84, a:'hockey', m:2}, {c:4e+87, a:'studio', m:2}, {c:10e+87, a:'all', m:3}, {c:20e+87, a:'all', m:6}, {c:29e+87, a:'bank', m:2},
           {c:145e+87, a:'oil', m:2}, {c:300e+87, a:'lemon', m:2}, {c:500e+87, a:'all', m:2}, {c:1e+90, a:'all', m:5}, {c:5e+90, a:'carwash', m:3},
           {c:150e+90, a:'carwash', m:3}, {c:400e+90, a:'carwash', m:3}, {c:900e+90, a:'pizza', m:3}, {c:6e+93, a:'pizza', m:3}, {c:15e+93, a:'pizza', m:3},
           {c:60e+93, a:'donut', m:2}, {c:185e+93, a:'donut', m:3}, {c:500e+93, a:'donut', m:3}, {c:600e+93, a:'all', m:3}, {c:750e+93, a:'shrimp', m:2},
           {c:5e+96, a:'shrimp', m:3}, {c:45e+96, a:'shrimp', m:3}, {c:125e+96, a:'hockey', m:3}, {c:300e+96, a:'hockey', m:3}, {c:900e+96, a:'hockey', m:3},
           {c:1e+99, a:'all', m:3}, {c:5e+99, a:'studio', m:2}, {c:70e+99, a:'studio', m:3}, {c:250e+99, a:'studio', m:3}, {c:500e+99, a:'bank', m:3},
           {c:900e+99, a:'bank', m:3}, {c:3e+102, a:'bank', m:3}, {c:15e+102, a:'oil', m:3}, {c:75e+102, a:'oil', m:3}, {c:400e+102, a:'oil', m:3},
           {c:500e+102, a:'lemon', m:3}, {c:750e+102, a:'lemon', m:3}, {c:1e+105, a:'lemon', m:3}, {c:2e+105, a:'news', m:3}, {c:20e+105, a:'news', m:3},
           {c:150e+105, a:'news', m:3}, {c:350e+105, a:'all', m:5}, {c:500e+105, a:'all', m:3}, {c:700e+105, a:'news', m:3}, {c:950e+105, a:'carwash', m:3},
           {c:4e+108, a:'pizza', m:3}, {c:9e+108, a:'donut', m:3}, {c:24e+108, a:'shrimp', m:3}, {c:111e+108, a:'hockey', m:3}, {c:222e+108, a:'studio', m:3},
           {c:333e+108, a:'bank', m:3}, {c:444e+108, a:'oil', m:3}, {c:555e+108, a:'lemon', m:3}, {c:666e+108, a:'all', m:6.66}, {c:1e+111, a:'all', m:3},
           {c:3e+111, a:'news', m:3}, {c:6e+111, a:'carwash', m:3}, {c:12e+111, a:'pizza', m:3}, {c:24e+111, a:'donut', m:3}, {c:48e+111, a:'shrimp', m:3},
           {c:96e+111, a:'hockey', m:3}, {c:192e+111, a:'studio', m:3}, {c:384e+111, a:'bank', m:3}, {c:768e+111, a:'oil', m:3}, {c:1e+114, a:'lemon', m:3},
           {c:10e+114, a:'all', m:5}, {c:2e+117, a:'carwash', m:3}, {c:5e+117, a:'bank', m:3}, {c:13e+117, a:'pizza', m:3}, {c:29e+117, a:'oil', m:3},
           {c:71e+117, a:'lemon', m:3}, {c:177e+117, a:'hockey', m:3}, {c:250e+117, a:'news', m:3}, {c:310e+117, a:'studio', m:3}, {c:555e+117, a:'donut', m:3},
           {c:736e+117, a:'shrimp', m:3}, {c:900e+117, a:'all', m:2}, {c:5e+120, a:'news', m:2}, {c:95e+120, a:'carwash', m:2}, {c:213e+120, a:'pizza', m:2},
           {c:400e+120, a:'donut', m:2}, {c:985e+120, a:'shrimp', m:2}, {c:8e+123, a:'hockey', m:2}, {c:29e+123, a:'studio', m:2}, {c:222e+123, a:'bank', m:2},
           {c:500e+123, a:'oil', m:2}, {c:900e+123, a:'lemon', m:2}, {c:5e+126, a:'all', m:3}, {c:136e+126, a:'news', m:3}, {c:700e+126, a:'carwash', m:3},
           {c:925e+126, a:'pizza', m:3}, {c:3e+129, a:'all', m:3}, {c:21e+129, a:'donut', m:3}, {c:55e+129, a:'shrimp', m:3}, {c:111e+129, a:'hockey', m:3},
           {c:223e+129, a:'studio', m:3}, {c:393e+129, a:'bank', m:3}, {c:600e+129, a:'oil', m:3}, {c:799e+129, a:'lemon', m:3}, {c:2e+132, a:'all', m:3},
           {c:3e+132, a:'news', m:3}, {c:6e+132, a:'carwash', m:3}, {c:9e+132, a:'pizza', m:3}, {c:21e+132, a:'donut', m:3}, {c:44e+132, a:'shrimp', m:3},
           {c:89e+132, a:'hockey', m:3}, {c:129e+132, a:'studio', m:3}, {c:180e+132, a:'bank', m:3}, {c:210e+132, a:'oil', m:3}, {c:300e+132, a:'lemon', m:3},
           {c:450e+132, a:'all', m:2.71828}, {c:5e+135, a:'shrimp', m:5}, {c:30e+135, a:'news', m:5}, {c:180e+135, a:'carwash', m:5}, {c:900e+135, a:'bank', m:5},
           {c:5e+138, a:'pizza', m:5}, {c:20e+138, a:'oil', m:5}, {c:80e+138, a:'donut', m:5}, {c:240e+138, a:'lemon', m:5}, {c:720e+138, a:'hockey', m:5},
           {c:21e+141, a:'studio', m:5}, {c:777e+147 , a:'pizza', m:3}, {c:888e+156, a:'news', m:2}, {c:999e+156, a:'carwash', m:2}, {c:2e+159, a:'bank', m:2},
           {c:4e+159, a:'pizza', m:2}, {c:8e+159, a:'oil', m:2}, {c:16e+159, a:'donut', m:2}, {c:32e+159, a:'lemon', m:2}, {c:64e+159, a:'hockey', m:2},
           {c:128e+159, a:'studio', m:2}, {c:514e+159, a:'all', m:2.99792458}, {c:1e+162, a:'shrimp', m:3}, {c:10e+162, a:'news', m:3}, {c:25e+162, a:'carwash', m:3},
           {c:50e+162, a:'bank', m:3}, {c:75e+162, a:'pizza', m:3}, {c:100e+162, a:'oil', m:3}, {c:150e+162, a:'donut', m:3}, {c:200e+162, a:'lemon', m:3},
           {c:300e+162, a:'hockey', m:3}, {c:400e+162, a:'studio', m:3}, {c:900e+162, a:'all', m:2.35711}, {c:1e+165, a:'studio', m:24}, {c:250e+165, a:'all', m:2},
           {c:500e+165, a:'news', m:22}, {c:750e+165, a:'all', m:2}, {c:1e+168, a:'carwash', m:20}, {c:250e+168, a:'all', m:2}, {c:500e+168, a:'bank', m:18},
           {c:750e+168, a:'all', m:2}, {c:1e+171, a:'shrimp', m:16}, {c:250e+171, a:'all', m:2}, {c:500e+171, a:'hockey', m:14}, {c:750e+171, a:'all', m:2},
           {c:1e+174, a:'oil', m:12}, {c:250e+174, a:'all', m:2}, {c:500e+174, a:'lemon', m:10}, {c:750e+174, a:'all', m:2}, {c:1e+177, a:'pizza', m:8},
           {c:250e+177, a:'all', m:2}, {c:500e+177, a:'donut', m:4}, {c:1e+180, a:'all', m:1.8}, {c:5e+186, a:'all', m:9.87654321}, {c:5e+191, a:'all', m:5},
           {c:27e+195, a:'all', m:3}, {c:13e+198, a:'all', m:4}, {c:14e+204, a:'news', m:3}, {c:198e+204, a:'pizza', m:3}, {c:322e+204, a:'donut', m:3},
           {c:888e+204, a:'hockey', m:3}, {c:19e+207, a:'studio', m:3}, {c:199e+207, a:'oil', m:3}, {c:233e+207, a:'lemon', m:3}, {c:421e+207, a:'news', m:3},
           {c:607e+207, a:'carwash', m:3}, {c:777e+207, a:'pizza', m:3}, {c:910e+207, a:'donut', m:3}, {c:2e+210, a:'shrimp', m:3}, {c:45e+210, a:'studio', m:3},
           {c:200e+210, a:'bank', m:3}, {c:600e+210, a:'all', m:5}, {c:10e+216, a:'lemon', m:11}, {c:10e+216, a:'news', m:11}, {c:10e+216, a:'carwash', m:11},
           {c:10e+216, a:'pizza', m:11}, {c:10e+216, a:'donut', m:11}, {c:10e+216, a:'shrimp', m:11}, {c:10e+216, a:'hockey', m:11}, {c:10e+216, a:'studio', m:11},
           {c:10e+216, a:'bank', m:11}, {c:10e+216, a:'oil', m:11}, {c:150e+216, a:'lemon', m:3}, {c:166e+216, a:'news', m:3}, {c:193e+216, a:'carwash', m:3},
           {c:410e+216, a:'pizza', m:3}, {c:678e+216, a:'donut', m:3}, {c:900e+216, a:'shrimp', m:3}, {c:12e+219, a:'hockey', m:3}, {c:67e+219, a:'studio', m:3},
           {c:123e+219, a:'bank', m:3}, {c:321e+219, a:'oil', m:3}, {c:555e+219, a:'all', m:5}, {c:800e+219, a:'lemon', m:3}, {c:800e+219, a:'news', m:3},
           {c:800e+219, a:'carwash', m:3}, {c:900e+219, a:'pizza', m:3}, {c:3e+222, a:'donut', m:3}, {c:4e+222, a:'shrimp', m:3}, {c:5e+222, a:'hockey', m:3},
           {c:6e+222, a:'studio', m:3}, {c:300e+222, a:'bank', m:3}, {c:421e+222, a:'oil', m:3}, {c:600e+222, a:'lemon', m:3}, {c:789e+222, a:'news', m:3},
           {c:845e+222, a:'carwash', m:3}, {c:2e+225, a:'pizza', m:3}, {c:5e+225, a:'donut', m:3}, {c:14e+225, a:'shrimp', m:3}, {c:54e+225, a:'hockey', m:3},
           {c:108e+225, a:'studio', m:3}, {c:219e+225, a:'bank', m:3}, {c:468e+225, a:'oil', m:3}, {c:1e+231, a:'lemon', m:7}, {c:1e+231, a:'news', m:7},
           {c:1e+231, a:'carwash', m:7}, {c:1e+231, a:'pizza', m:7}, {c:1e+231, a:'donut', m:7}, {c:1e+231, a:'shrimp', m:7}, {c:1e+231, a:'hockey', m:7},
           {c:1e+231, a:'studio', m:7}, {c:1e+231, a:'bank', m:7}, {c:1e+231, a:'oil', m:7}, {c:100e+231, a:'all', m:5}, {c:3e+234, a:'lemon', m:3},
           {c:8e+234, a:'news', m:3}, {c:69e+234, a:'carwash', m:3}, {c:100e+234, a:'all', m:2}, {c:188e+234, a:'pizza', m:3}, {c:239e+234, a:'donut', m:3},
           {c:411e+234, a:'shrimp', m:3}, {c:700e+234, a:'hockey', m:3}, {c:912e+234, a:'studio', m:3}, {c:12e+237, a:'bank', m:3}, {c:24e+237, a:'oil', m:3},
           {c:63e+237, a:'lemon', m:3}, {c:199e+237, a:'news', m:3}, {c:398e+237, a:'carwash', m:3}, {c:566e+237, a:'pizza', m:3}, {c:700e+237, a:'donut', m:3},
           {c:800e+237, a:'shrimp', m:3}, {c:900e+237, a:'hockey', m:3}, {c:10e+240, a:'all', m:4}, {c:12e+240, a:'studio', m:3}, {c:25e+240, a:'bank', m:3},
           {c:50e+240, a:'oil', m:3}, {c:1e+243, a:'lemon', m:2}, {c:5e+243, a:'news', m:2}, {c:9e+243, a:'carwash', m:2}, {c:10e+243, a:'all', m:3},
           {c:21e+243, a:'pizza', m:2}, {c:45e+243, a:'donut', m:2}, {c:89e+243, a:'shrimp', m:2}, {c:153e+243, a:'hockey', m:2}, {c:299e+243, a:'studio', m:2},
           {c:577e+243, a:'bank', m:2}, {c:813e+243, a:'oil', m:2}, {c:2e+246, a:'lemon', m:2}, {c:10e+246, a:'all', m:6}, {c:22e+246, a:'news', m:2},
           {c:44e+246, a:'carwash', m:2}, {c:66e+246, a:'pizza', m:2}, {c:88e+246, a:'donut', m:2}, {c:111e+246, a:'shrimp', m:2}, {c:222e+246, a:'hockey', m:2},
           {c:333e+246, a:'studio', m:2}, {c:444e+246, a:'bank', m:2}, {c:555e+246, a:'oil', m:2}, {c:10e+249, a:'all', m:4}, {c:10e+252, a:'all', m:7},
           {c:1e+255, a:'all', m:5}, {c:10e+255, a:'all', m:2}, {c:10e+255, a:'lemon', m:3}, {c:10e+255, a:'news', m:3}, {c:10e+255, a:'carwash', m:3},
           {c:10e+255, a:'pizza', m:3}, {c:10e+255, a:'donut', m:3}, {c:10e+255, a:'shrimp', m:3}, {c:10e+255, a:'hockey', m:3}, {c:10e+255, a:'studio', m:3},
           {c:10e+255, a:'bank', m:3}, {c:10e+255, a:'oil', m:3}, {c:50e+255, a:'lemon', m:9}, {c:75e+255, a:'news', m:9}, {c:125e+255, a:'carwash', m:9},
           {c:625e+255, a:'pizza', m:9}, {c:3e+258, a:'donut', m:9}, {c:10e+258, a:'all', m:6}, {c:15e+258, a:'shrimp', m:9}, {c:75e+258, a:'hockey', m:9},
           {c:375e+258, a:'studio', m:9}, {c:800e+258, a:'oil', m:9}, {c:1e+261, a:'bank', m:9}, {c:2.5e+261, a:'all', m:2}, {c:6.4e+261, a:'lemon', m:3},
           {c:10e+261, a:'all', m:5}, {c:12.2e+261, a:'news', m:3}, {c:233e+261, a:'carwash', m:3}, {c:399e+261, a:'pizza', m:3}, {c:766e+261, a:'donut', m:3},
           {c:1e+264, a:'shrimp', m:3}, {c:10e+264, a:'all', m:5}, {c:19e+264, a:'hockey', m:3}, {c:98e+264, a:'studio', m:3}, {c:260e+264, a:'bank', m:3},
           {c:544e+264, a:'oil', m:3}, {c:700e+264, a:'lemon', m:3}, {c:1e+267, a:'news', m:3}, {c:10e+267, a:'all', m:3}, {c:45e+267, a:'carwash', m:3},
           {c:69e+267, a:'pizza', m:3}, {c:89e+267, a:'donut', m:3}, {c:189e+267, a:'shrimp', m:3}, {c:289e+267, a:'hockey', m:3}, {c:448e+267, a:'studio', m:3},
           {c:900e+267, a:'bank', m:3}, {c:5e+270, a:'oil', m:3}, {c:10e+270, a:'all', m:7}, {c:1e+273, a:'all', m:5}, {c:1e+276, a:'lemon', m:7},
           {c:2e+276, a:'news', m:7}, {c:3e+276, a:'carwash', m:7}, {c:6e+276, a:'pizza', m:7}, {c:25e+276, a:'donut', m:7}, {c:200e+276, a:'shrimp', m:7},
           {c:600e+276, a:'hockey', m:7}, {c:999e+276, a:'studio', m:7}, {c:10e+279, a:'all', m:4}, {c:15e+279, a:'bank', m:7}, {c:30e+279, a:'oil', m:7},
           {c:10e+282, a:'all', m:5}, {c:10e+285, a:'all', m:7.77}, {c:1e+288, a:'news', m:13}, {c:1e+288, a:'carwash', m:13}, {c:1e+288, a:'pizza', m:13},
           {c:1e+288, a:'donut', m:13}, {c:1e+288, a:'shrimp', m:13}, {c:1e+288, a:'hockey', m:13}, {c:1e+288, a:'studio', m:13}, {c:1e+288, a:'bank', m:13},
           {c:1e+288, a:'oil', m:13}, {c:10e+288, a:'all', m:7.77}, {c:1e+291, a:'all', m:77.77}
   ];

   var usedUpgrades = [];

   var unlocks = {
       lemon: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'}, {a: 300, m: 2, t: 'speed'},
           {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'}, {a: 700, m: 4, t: 'profit'}, {a: 800, m: 4, t: 'profit'},
           {a: 900, m: 4, t: 'profit'}, {a: 1000, m: 5, t: 'profit'}, {a: 1100, m: 4, t: 'profit'}, {a: 1200, m: 4, t: 'profit'}, {a: 1300, m: 4, t: 'profit'},
           {a: 1400, m: 4, t: 'profit'}, {a: 1500, m: 4, t: 'profit'}, {a: 1600, m: 4, t: 'profit'}, {a: 1700, m: 4, t: 'profit'}, {a: 1800, m: 4, t: 'profit'},
           {a: 1900, m: 4, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2250, m: 2, t: 'profit'},   {a: 2500, m: 2, t: 'profit'},
           {a: 2750, m: 2, t: 'profit'}, {a: 3000, m: 5, t: 'profit'}, {a: 3250, m: 2, t: 'profit'}, {a: 3500, m: 2, t: 'profit'},
           {a: 3750, m: 2, t: 'profit'}, {a: 4000, m: 5, t: 'profit'}, {a: 4250, m: 2, t: 'profit'}, {a: 4500, m: 2, t: 'profit'},
           {a: 4750, m: 2, t: 'profit'}, {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 3, t: 'profit'}, {a: 5500, m: 3, t: 'profit'},
           {a: 5750, m: 3, t: 'profit'}, {a: 6000, m: 5, t: 'profit'}, {a: 6250, m: 3, t: 'profit'}, {a: 6500, m: 3, t: 'profit'},
           {a: 6750, m: 3, t: 'profit'}, {a: 7000, m: 3, t: 'profit'}, {a: 7250, m: 3, t: 'profit'}, {a: 7500, m: 3, t: 'profit'},
           {a: 7750, m: 3, t: 'profit'}, {a: 7777, m: 3, t: 'profit'}, {a: 8000, m: 3, t: 'profit'}, {a: 8200, m: 3, t: 'profit'},
           {a: 8400, m: 3, t: 'profit'}, {a: 8600, m: 3, t: 'profit'}, {a: 8800, m: 3, t: 'profit'}, {a: 9000, m: 3, t: 'profit'},
           {a: 9100, m: 3, t: 'profit'}, {a: 9200, m: 3, t: 'profit'}, {a: 9300, m: 3, t: 'profit'}, {a: 9400, m: 3, t: 'profit'},
           {a: 9500, m: 3, t: 'profit'}, {a: 9600, m: 3, t: 'profit'}, {a: 9700, m: 3, t: 'profit'}, {a: 9800, m: 3, t: 'profit'},
           {a: 9999, m: 1.99, t: 'profit'},{a: 10000, m: 5, t: 'profit'}
       ],
       news: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 125, m: 2, t: 'profit', c: 'lemon'},
           {a: 150, m: 2, t: 'profit', c: 'carwash'}, {a: 175, m: 2, t: 'profit', c: 'pizza'}, {a: 200, m: 2, t: 'speed'}, {a: 225, m: 2, t: 'profit', c: 'donut'},
           {a: 250, m: 2, t: 'profit', c: 'lemon'}, {a: 275, m: 3, t: 'profit', c: 'carwash'}, {a: 300, m: 2, t: 'speed'}, {a: 325, m: 3, t: 'profit', c: 'pizza'},
           {a: 350, m: 3, t: 'profit', c: 'donut'}, {a: 375, m: 4, t: 'profit', c: 'lemon'}, {a: 400, m: 2, t: 'speed'}, {a: 425, m: 4, t: 'profit', c: 'carwash'},
           {a: 450, m: 4, t: 'profit', c: 'pizza'}, {a: 475, m: 4, t: 'profit', c: 'donut'}, {a: 500, m: 11, t: 'profit', c: 'shrimp'}, {a: 525, m: 5, t: 'profit', c: 'lemon'},
           {a: 550, m: 5, t: 'profit', c: 'carwash'}, {a: 575, m: 5, t: 'profit', c: 'pizza'}, {a: 600, m: 11, t: 'hockey', c: 'hockey'}, {a: 625, m: 5, t: 'profit', c: 'donut'},
           {a: 650, m: 6, t: 'profit', c: 'lemon'}, {a: 675, m: 6, t: 'profit', c: 'carwash'}, {a: 700, m: 11, t: 'profit', c: 'studio'}, {a: 725, m: 6, t: 'profit', c: 'pizza'},
           {a: 750, m: 6, t: 'profit', c: 'donut'}, {a: 775, m: 3, t: 'profit', c: 'lemon'}, {a: 800, m: 11, t: 'profit', c: 'bank'}, {a: 825, m: 7, t: 'profit', c: 'carwash'},
           {a: 850, m: 7, t: 'profit', c: 'pizza'}, {a: 875, m: 7, t: 'profit', c: 'donut'}, {a: 900, m: 11, t: 'profit', c: 'oil'}, {a: 925, m: 7, t: 'profit', c: 'shrimp'},
           {a: 950, m: 7, t: 'profit', c: 'hockey'}, {a: 975, m: 7, t: 'profit', c: 'studio'}, {a: 1000, m: 7777777, t: 'profit'}, {a: 1025, m: 7, t: 'profit', c: 'bank'},
           {a: 1050, m: 7, t: 'profit', c: 'oil'}, {a: 1075, m: 8, t: 'profit', c: 'carwash'}, {a: 1100, m: 8, t: 'profit', c: 'pizza'}, {a: 1125, m: 8, t: 'profit', c: 'donut'},
           {a: 1150, m: 8, t: 'profit', c: 'shrimp'}, {a: 1175, m: 8, t: 'profit', c: 'hockey'}, {a: 1200, m: 8, t: 'profit', c: 'studio'}, {a: 1225, m: 8, t: 'profit', c: 'bank'},
           {a: 1250, m: 8, t: 'profit', c: 'oil'}, {a: 1300, m: 7777, t: 'profit'}, {a: 1350, m: 9, t: 'profit', c: 'lemon'}, {a: 1400, m: 9, t: 'profit', c: 'carwash'},
           {a: 1450, m: 9, t: 'profit', c: 'pizza'}, {a: 1500, m: 9, t: 'profit', c: 'donut'}, {a: 1550, m: 9, t: 'profit', c: 'shrimp'}, {a: 1600, m: 9, t: 'profit', c: 'hockey'},
           {a: 1650, m: 9, t: 'profit', c: 'studio'}, {a: 1700, m: 9, t: 'profit', c: 'bank'}, {a: 1750, m: 9, t: 'profit', c: 'oil'}, {a: 1800, m: 9, t: 'profit', c: 'shrimp'},
           {a: 1850, m: 9, t: 'profit', c: 'hockey'}, {a: 1900, m: 9, t: 'profit', c: 'studio'}, {a: 1950, m: 9, t: 'profit', c: 'bank'}, {a: 2000, m: 7777, t: 'profit'},
           {a: 2100, m: 15, t: 'profit', c: 'carwash'}, {a: 2200, m: 15, t: 'profit', c: 'pizza'}, {a: 2300, m: 15, t: 'profit', c: 'donut'}, {a: 2400, m: 15, t: 'profit', c: 'shrimp'},
           {a: 2500, m: 777, t: 'profit'}, {a: 2600, m: 15, t: 'profit', c: 'studio'}, {a: 2700, m: 15, t: 'profit', c: 'bank'}, {a: 2800, m: 15, t: 'profit', c: 'oil'},
           {a: 2900, m: 15, t: 'profit', c: 'lemon'}, {a: 3000, m: 777, t: 'profit'}, {a: 3100, m: 20, t: 'profit', c: 'carwash'}, {a: 3200, m: 20, t: 'profit', c: 'hockey'},
           {a: 3300, m: 20, t: 'profit', c: 'bank'}, {a: 3400, m: 20, t: 'profit', c: 'oil'}, {a: 3500, m: 777, t: 'profit'}, {a: 3600, m: 25, t: 'profit', c: 'hockey'},
           {a: 3700, m: 25, t: 'profit', c: 'studio'}, {a: 3800, m: 25, t: 'profit', c: 'bank'}, {a: 3900, m: 25, t: 'profit', c: 'oil'}, {a: 4000, m: 30, t: 'profit'},
           {a: 4100, m: 30, t: 'profit', c: 'lemon'}, {a: 4200, m: 30, t: 'profit', c: 'carwash'}, {a: 4300, m: 30, t: 'profit', c: 'pizza'}, {a: 4400, m: 30, t: 'profit', c: 'donut'},
           {a: 4500, m: 30, t: 'profit', c: 'shrimp'}, {a: 4600, m: 30, t: 'profit', c: 'hockey'}, {a: 4700, m: 30, t: 'profit', c: 'studio'}, {a: 4800, m: 30, t: 'profit', c: 'bank'},
           {a: 4900, m: 30, t: 'profit', c: 'oil'}, {a: 5000, m: 50, t: 'profit'}, {a: 5100, m: 50, t: 'profit'}, {a: 5200, m: 50, t: 'profit'},
           {a: 5300, m: 50, t: 'profit'}, {a: 5400, m: 50, t: 'profit'}
       ],
       carwash: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 3, t: 'profit'}, {a: 2200, m: 3, t: 'profit'},   {a: 2300, m: 3, t: 'profit'},
           {a: 2400, m: 3, t: 'profit'}, {a: 2500, m: 3, t: 'profit'}, {a: 2600, m: 3, t: 'profit'}, {a: 2700, m: 3, t: 'profit'},
           {a: 2800, m: 3, t: 'profit'}, {a: 2900, m: 3, t: 'profit'}, {a: 3000, m: 3, t: 'profit'}, {a: 3100, m: 3, t: 'profit'},
           {a: 3200, m: 3, t: 'profit'}, {a: 3300, m: 3, t: 'profit'}, {a: 3400, m: 3, t: 'profit'}, {a: 3500, m: 3, t: 'profit'},
           {a: 3600, m: 3, t: 'profit'}, {a: 3700, m: 5, t: 'profit'}, {a: 3800, m: 3, t: 'profit'}, {a: 3900, m: 3, t: 'profit'},
           {a: 4000, m: 5, t: 'profit'}, {a: 4100, m: 3, t: 'profit'}, {a: 4200, m: 3, t: 'profit'}, {a: 4300, m: 3, t: 'profit'},
           {a: 4400, m: 3, t: 'profit'}, {a: 4500, m: 3, t: 'profit'}, {a: 4600, m: 3, t: 'profit'}, {a: 4700, m: 3, t: 'profit'},
           {a: 4800, m: 3, t: 'profit'}, {a: 4900, m: 3, t: 'profit'}, {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}
       ],
       pizza: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 3, t: 'profit'}, {a: 2200, m: 3, t: 'profit'},   {a: 2300, m: 3, t: 'profit'},
           {a: 2400, m: 3, t: 'profit'}, {a: 2500, m: 3, t: 'profit'}, {a: 2600, m: 3, t: 'profit'}, {a: 2700, m: 3, t: 'profit'},
           {a: 2800, m: 3, t: 'profit'}, {a: 2900, m: 3, t: 'profit'}, {a: 3000, m: 3, t: 'profit'}, {a: 3100, m: 3, t: 'profit'},
           {a: 3200, m: 3, t: 'profit'}, {a: 3300, m: 3, t: 'profit'}, {a: 3400, m: 3, t: 'profit'}, {a: 3500, m: 3, t: 'profit'},
           {a: 3600, m: 3, t: 'profit'}, {a: 3700, m: 3, t: 'profit'}, {a: 3800, m: 5, t: 'profit'}, {a: 3900, m: 3, t: 'profit'},
           {a: 4000, m: 5, t: 'profit'}, {a: 4100, m: 3, t: 'profit'}, {a: 4200, m: 3, t: 'profit'}, {a: 4300, m: 3, t: 'profit'},
           {a: 4400, m: 3, t: 'profit'}, {a: 4500, m: 3, t: 'profit'}, {a: 4600, m: 3, t: 'profit'}, {a: 4700, m: 3, t: 'profit'},
           {a: 4800, m: 3, t: 'profit'}, {a: 4900, m: 3, t: 'profit'}, {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'}
       ],
       donut: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 3, t: 'profit'}, {a: 2200, m: 3, t: 'profit'},   {a: 2300, m: 3, t: 'profit'},
           {a: 2400, m: 3, t: 'profit'}, {a: 2500, m: 3, t: 'profit'}, {a: 2600, m: 3, t: 'profit'}, {a: 2700, m: 3, t: 'profit'},
           {a: 2800, m: 3, t: 'profit'}, {a: 2900, m: 3, t: 'profit'}, {a: 3000, m: 3, t: 'profit'}, {a: 3100, m: 3, t: 'profit'},
           {a: 3200, m: 3, t: 'profit'}, {a: 3300, m: 3, t: 'profit'}, {a: 3400, m: 3, t: 'profit'}, {a: 3500, m: 3, t: 'profit'},
           {a: 3600, m: 3, t: 'profit'}, {a: 3700, m: 3, t: 'profit'}, {a: 3800, m: 3, t: 'profit'}, {a: 3900, m: 3, t: 'profit'},
           {a: 4000, m: 5, t: 'profit'}, {a: 4100, m: 3, t: 'profit'}, {a: 4200, m: 3, t: 'profit'}, {a: 4300, m: 3, t: 'profit'},
           {a: 4400, m: 3, t: 'profit'}, {a: 4500, m: 3, t: 'profit'}, {a: 4600, m: 3, t: 'profit'}, {a: 4700, m: 3, t: 'profit'},
           {a: 4800, m: 3, t: 'profit'}, {a: 4900, m: 3, t: 'profit'}, {a: 5000, m: 3, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'}, {a: 6000, m: 3, t: 'profit'}, {a: 6250, m: 3, t: 'profit'}
       ],
       shrimp: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 3, t: 'profit'}, {a: 2200, m: 3, t: 'profit'},   {a: 2300, m: 3, t: 'profit'},
           {a: 2400, m: 3, t: 'profit'}, {a: 2500, m: 3, t: 'profit'}, {a: 2600, m: 3, t: 'profit'}, {a: 2700, m: 3, t: 'profit'},
           {a: 2800, m: 3, t: 'profit'}, {a: 2900, m: 3, t: 'profit'}, {a: 3000, m: 3, t: 'profit'}, {a: 3250, m: 3, t: 'profit'},
           {a: 3500, m: 3, t: 'profit'}, {a: 3750, m: 3, t: 'profit'}, {a: 4000, m: 5, t: 'profit'}, {a: 4250, m: 3, t: 'profit'},
           {a: 4500, m: 5, t: 'profit'}, {a: 4750, m: 3, t: 'profit'}, {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'}, {a: 6000, m: 5, t: 'profit'}, {a: 6250, m: 3, t: 'profit'},
           {a: 6500, m: 3, t: 'profit'},
       ],
       hockey: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 2, t: 'speed'}, {a: 2200, m: 3, t: 'profit'},   {a: 2300, m: 2, t: 'speed'},
           {a: 2400, m: 3, t: 'profit'}, {a: 2500, m: 2, t: 'speed'}, {a: 2600, m: 3, t: 'profit'}, {a: 2700, m: 2, t: 'speed'},
           {a: 2800, m: 3, t: 'profit'}, {a: 2900, m: 3, t: 'profit'}, {a: 3000, m: 3, t: 'profit'}, {a: 3250, m: 3, t: 'profit'},
           {a: 3500, m: 3, t: 'profit'}, {a: 3750, m: 3, t: 'profit'}, {a: 4000, m: 5, t: 'profit'}, {a: 4250, m: 3, t: 'profit'},
           {a: 4500, m: 5, t: 'profit'}, {a: 4750, m: 3, t: 'profit'}, {a: 5000, m: 7, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'}, {a: 6000, m: 7, t: 'profit'}, {a: 6250, m: 3, t: 'profit'},
           {a: 6500, m: 3, t: 'profit'}, {a: 6750, m: 3, t: 'profit'}, {a: 7000, m: 7, t: 'profit'}
       ],
       studio: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2100, m: 2, t: 'speed'}, {a: 2200, m: 2, t: 'profit'},   {a: 2300, m: 2, t: 'speed'},
           {a: 2400, m: 2, t: 'profit'}, {a: 2500, m: 2, t: 'speed'}, {a: 2600, m: 2, t: 'profit'}, {a: 2700, m: 2, t: 'speed'},
           {a: 2800, m: 2, t: 'profit'}, {a: 2900, m: 2, t: 'profit'}, {a: 3000, m: 2, t: 'profit'}, {a: 3250, m: 2, t: 'speed'},
           {a: 3500, m: 2, t: 'profit'}, {a: 3750, m: 2, t: 'profit'}, {a: 4000, m: 2, t: 'profit'}, {a: 4250, m: 3, t: 'profit'},
           {a: 4500, m: 3, t: 'profit'}, {a: 4750, m: 3, t: 'profit'}, {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 3, t: 'profit'},
           {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'}, {a: 6000, m: 9, t: 'profit'}, {a: 6250, m: 3, t: 'profit'},
           {a: 6500, m: 3, t: 'profit'}, {a: 6750, m: 3, t: 'profit'}, {a: 7000, m: 9, t: 'profit'}, {a: 7250, m: 3, t: 'profit'},
           {a: 7500, m: 3, t: 'profit'}, {a: 7750, m: 3, t: 'profit'}
       ],
       bank: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2250, m: 2, t: 'speed'}, {a: 2500, m: 2, t: 'speed'},   {a: 2750, m: 2, t: 'speed'},
           {a: 3000, m: 2, t: 'speed'}, {a: 3250, m: 2, t: 'speed'}, {a: 3500, m: 2, t: 'speed'}, {a: 3750, m: 2, t: 'speed'},
           {a: 4000, m: 2, t: 'speed'}, {a: 4250, m: 3, t: 'profit'}, {a: 4500, m: 3, t: 'profit'}, {a: 4750, m: 3, t: 'profit'},
           {a: 5000, m: 5, t: 'profit'}, {a: 5250, m: 5, t: 'profit'}, {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'},
           {a: 6000, m: 5, t: 'profit'}, {a: 6250, m: 3, t: 'profit'}, {a: 6500, m: 3, t: 'profit'}, {a: 6750, m: 3, t: 'profit'},
           {a: 7000, m: 5, t: 'profit'}, {a: 7250, m: 3, t: 'profit'}, {a: 7500, m: 3, t: 'profit'}, {a: 7750, m: 3, t: 'profit'},
           {a: 8000, m: 5, t: 'profit'}, {a: 8250, m: 3, t: 'profit'}, {a: 8500, m: 3, t: 'profit'}
       ],
       oil: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 4, t: 'profit'}, {a: 600, m: 4, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 3, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 5, t: 'profit'}, {a: 2250, m: 2, t: 'speed'}, {a: 2500, m: 2, t: 'speed'},   {a: 2750, m: 2, t: 'speed'},
           {a: 3000, m: 2, t: 'speed'}, {a: 3250, m: 2, t: 'speed'}, {a: 3500, m: 2, t: 'speed'}, {a: 3750, m: 2, t: 'speed'},
           {a: 4000, m: 2, t: 'speed'}, {a: 4250, m: 2, t: 'speed'}, {a: 4500, m: 2, t: 'speed'}, {a: 4750, m: 2, t: 'speed'},
           {a: 5000, m: 2, t: 'speed'}, {a: 5250, m: 5, t: 'profit'}, {a: 5500, m: 3, t: 'profit'}, {a: 5750, m: 3, t: 'profit'},
           {a: 6000, m: 5, t: 'profit'}, {a: 6250, m: 3, t: 'profit'}, {a: 6500, m: 3, t: 'profit'}, {a: 6750, m: 3, t: 'profit'},
           {a: 7000, m: 7, t: 'profit'}, {a: 7250, m: 3, t: 'profit'}, {a: 7500, m: 3, t: 'profit'}, {a: 7750, m: 3, t: 'profit'},
           {a: 8000, m: 3, t: 'profit'}, {a: 8250, m: 3, t: 'profit'}, {a: 8500, m: 3, t: 'profit'}, {a: 8750, m: 3, t: 'profit'},
           {a: 9000, m: 7, t: 'profit'}, {a: 9250, m: 3, t: 'profit'}, {a: 9500, m: 3, t: 'profit'}, {a: 9750, m: 3, t: 'profit'}
       ],
       super: [
           {a: 25, m: 2, t: 'speed'}, {a: 50, m: 2, t: 'speed'}, {a: 100, m: 2, t: 'speed'}, {a: 200, m: 2, t: 'speed'},
           {a: 300, m: 2, t: 'speed'}, {a: 400, m: 2, t: 'speed'}, {a: 500, m: 2, t: 'profit'}, {a: 600, m: 2, t: 'profit'}, {a: 666, m: 2, t: 'profit'},
           {a: 700, m: 2, t: 'profit'}, {a: 777, m: 2, t: 'profit'}, {a: 800, m: 2, t: 'profit'}, {a: 900, m: 2, t: 'profit'}, {a: 1000, m: 2, t: 'profit'},
           {a: 1100, m: 2, t: 'profit'}, {a: 1111, m: 2, t: 'profit'}, {a: 1200, m: 2, t: 'profit'}, {a: 1300, m: 2, t: 'profit'}, {a: 1400, m: 2, t: 'profit'},
           {a: 1500, m: 2, t: 'profit'}, {a: 1600, m: 2, t: 'profit'}, {a: 1700, m: 2, t: 'profit'}, {a: 1800, m: 2, t: 'profit'},
           {a: 1900, m: 2, t: 'profit'}, {a: 2000, m: 2, t: 'profit'}, {a: 2100, m: 2, t: 'profit'}, {a: 2200, m: 2, t: 'profit'},
           {a: 2222, m: 2, t: 'profit'},  {a: 2300, m: 3, t: 'profit'},
           {a: 2400, m: 2, t: 'profit'}, {a: 2500, m: 2, t: 'profit'}, {a: 2600, m: 2, t: 'profit'}, {a: 2700, m: 2, t: 'profit'},
           {a: 2800, m: 2, t: 'profit'}, {a: 2900, m: 2, t: 'profit'}, {a: 3000, m: 2, t: 'profit'}, {a: 3100, m: 2, t: 'profit'},
           {a: 3200, m: 2, t: 'profit'}, {a: 3300, m: 2, t: 'profit'}, {a: 3333, m: 2, t: 'profit'}, {a: 3400, m: 2, t: 'profit'}, {a: 3500, m: 2, t: 'profit'},
           {a: 3600, m: 2, t: 'profit'}, {a: 3700, m: 2, t: 'profit'}, {a: 3800, m: 2, t: 'profit'}, {a: 3900, m: 2, t: 'profit'},
           {a: 4000, m: 2, t: 'profit'}, {a: 4100, m: 3, t: 'profit'}, {a: 4200, m: 3, t: 'profit'}, {a: 4300, m: 3, t: 'profit'},
           {a: 4400, m: 2, t: 'profit'}, {a: 4500, m: 2, t: 'profit'}, {a: 4600, m: 2, t: 'profit'}, {a: 4700, m: 2, t: 'profit'},
           {a: 4800, m: 2, t: 'profit'}, {a: 4900, m: 2, t: 'profit'}, {a: 5000, m: 2, t: 'profit'}
       ]
   };

   var usedUnlocks = {lemon: [], news: [], carwash: [], pizza: [], donut: [], shrimp: [], hockey: [], studio: [], bank: [], oil: [], super: []};

    var images = {
        lemon: imageBasePath + 'lemon.jpg',
        news: imageBasePath + 'news.jpg',
        carwash: imageBasePath + 'carwash.png',
        pizza: imageBasePath + 'pizza.jpg',
        donut: imageBasePath + 'donut.jpg',
        shrimp: imageBasePath + 'shrimp2.png',
        hockey: imageBasePath + 'hockey.png',
        studio: imageBasePath + 'studio.jpg',
        bank: imageBasePath + 'bank.png',
        oil: imageBasePath + 'oil.png',
        all: imageBasePath + 'moneybag.jpg',
        angel: imageBasePath + 'moneybag.jpg'
    };
    var companies = {
        lemon: {
            owned: 1,
            initialCost: 3.738,
            cost: 4,
            earnings: 1,
            initialEarnings: 1,
            duration: 0.6,
            initialDuration: 0.6,
            currentTime: 0,
            coefficient: 1.07,
            hasManager: false,
            isRunning: false
        },
        news: {
            owned: 0,
            initialCost: 60,
            cost: 60,
            earnings: 60,
            initialEarnings: 60,
            duration: 3,
            initialDuration: 3,
            currentTime: 0,
            coefficient: 1.15,
            hasManager: false,
            isRunning: false
        },
        carwash: {
            owned: 0,
            initialCost: 720,
            cost: 720,
            earnings: 540,
            initialEarnings: 540,
            duration: 6,
            initialDuration: 6,
            currentTime: 0,
            coefficient: 1.14,
            hasManager: false,
            isRunning: false
        },
        pizza: {
            owned: 0,
            initialCost: 8640,
            cost: 8640,
            earnings: 4320,
            initialEarnings: 4320,
            duration: 12,
            initialDuration: 12,
            currentTime: 0,
            coefficient: 1.13,
            hasManager: false,
            isRunning: false
        },
        donut: {
            owned: 0,
            initialCost: 103680,
            cost: 103680,
            earnings: 51840,
            initialEarnings: 51840,
            duration: 24,
            initialDuration: 24,
            currentTime: 0,
            coefficient: 1.12,
            hasManager: false,
            isRunning: false
        },
        shrimp: {
            owned: 0,
            initialCost: 1244160,
            cost: 1244160,
            earnings: 622080,
            initialEarnings: 622080,
            duration: 96,
            initialDuration: 96,
            currentTime: 0,
            coefficient: 1.11,
            hasManager: false,
            isRunning: false
        },
        hockey: {
            owned: 0,
            initialCost: 14929920,
            cost: 14929920,
            earnings: 7464960,
            initialEarnings: 7464960,
            duration: 384,
            initialDuration: 384,
            currentTime: 0,
            coefficient: 1.10,
            hasManager: false,
            isRunning: false
        },
        studio: {
            owned: 0,
            initialCost: 179159040,
            cost: 179159040,
            earnings: 89579520,
            initialEarnings: 89579520,
            duration: 1536,
            initialDuration: 1536,
            currentTime: 0,
            coefficient: 1.09,
            hasManager: false,
            isRunning: false
        },
        bank: {
            owned: 0,
            initialCost: 2149908480,
            cost: 2149908480,
            earnings: 1074954240,
            initialEarnings: 1074954240,
            duration: 6144,
            initialDuration: 6144,
            currentTime: 0,
            coefficient: 1.08,
            hasManager: false,
            isRunning: false
        },
        oil: {
            owned: 0,
            initialCost: 25798901760,
            cost: 25798901760,
            earnings: 29668737024,
            initialEarnings: 29668737024,
            duration: 36864,
            initialDuration: 36864,
            currentTime: 0,
            coefficient: 1.07,
            hasManager: false,
            isRunning: false
        }
    };

    function linkCompanyElements() {
        for(var key in companies) {
            companies[key].timer = document.getElementById(key + 'Timer');
            companies[key].runButton = document.getElementById(key + 'RunButton');
            companies[key].buyButton = document.getElementById(key + 'BuyButton');
            companies[key].initialBuyButton = document.getElementById(key + 'InitialBuyButton');
            companies[key].ownedElement = document.getElementById(key + 'Owned');
            companies[key].costValueElement = document.getElementById(key + 'CostValue');
            companies[key].costNameElement = document.getElementById(key + 'CostName');
            companies[key].incrementElement = document.getElementById(key + 'IncrementElement');
            companies[key].earningsElement = document.getElementById(key + 'EarningsElement');
            companies[key].canvas = document.getElementById(key + 'ProgressCanvas');
            companies[key].ctx = document.getElementById(key + 'ProgressCanvas').getContext('2d');
            companies[key].ctx.strokeStyle = 'rgba(144, 238, 144, 0.2)';
            companies[key].ctx.lineCap = "square";
            companies[key].ctx.lineWidth = 20;
            companies[key].ctx.fillStyle = 'green';
            companies[key].moneySpent = key === 'lemon' ? companies[key].initialCost : 0;
            companies[key].name = key;

        }
        oneFifthCanvasWidth = Math.floor(companies.lemon.canvas.width / 5);
    }


    function setUpgradeElements() {
        upgradeElements.forEach(function(element, index) {
            if(typeof upgrades[index] !== 'undefined') {
                var cost = setNumericalValue(upgrades[index].c);
                document.getElementById(element.dataset.image).src = images[upgrades[index].a];
                document.getElementById(element.dataset.name).innerText = upgrades[index].a;
                document.getElementById(element.dataset.description).innerText = 'Increase profit of ' + upgrades[index].a + ' by x' + upgrades[index].m;
                document.getElementById(element.dataset.cost).innerText = '£' + cost.displayValue + ' ' + cost.displayName;
                document.getElementById(element.dataset.button).dataset.cost = upgrades[index].c;
                document.getElementById(element.dataset.button).dataset.company = upgrades[index].a;
                document.getElementById(element.dataset.button).dataset.multiplier = upgrades[index].m;
            } else {
                if(!!upgradeElements[index].parentNode) {
                    upgradeElements[index].parentNode.removeChild(upgradeElements[index]);
                }
            }
        });
    }

    var numberNames = ['Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion'];
    var numberTens = ['Decillion', 'Vigintillion', 'Trigintillion', 'Quadragintillion', 'Quinquagintillion', 'Sexagintillion', 'Septuagintillion', 'Octogintillion', 'Nonagintillion', 'Centillion'];
    var numberPrefixes = ['Un', 'Duo', 'Tre', 'Quatturo', 'Quin', 'Sex', 'Sept', 'Oct', 'Nov'];

    numberTens.forEach(function(name) {
        numberNames.push(name);
        numberPrefixes.forEach(function(prefix) {
            numberNames.push(prefix + name.toLowerCase());
        });
    });

    upgradeElements.forEach(function(element, index) {
        document.getElementById(element.dataset.button).addEventListener('click', purchaseUpgrade);
    });

    openMenuButtons.forEach(function(openMenuButton) {
        openMenuButton.addEventListener('click', function() {
            menus.forEach(function(menu) {
                menu.classList.remove('capitalism-menu-displayed');
            });
            document.getElementById(this.dataset.menu).classList.add('capitalism-menu-displayed');
        });
    });

    closeMenuButtons.forEach(function(closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            document.getElementById(this.dataset.menu).classList.remove('capitalism-menu-displayed');
        });
    });

    buyManagerButtons.forEach(function(buyManagerButton) {
        buyManagerButton.addEventListener('click', function() {
            if(this.dataset.cost < money) {
                companies[this.dataset.company].hasManager = true;
                companies[this.dataset.company].isRunning = true;
                document.getElementById(this.dataset.company + 'ManagerWrapper').classList.add('capitalism-now-puchased');
            }
        });
    });

    changeBuyIncrementButton.addEventListener('click', changeBuyIncrements);
    claimAngelButton.addEventListener('click', softReset);

    function setup() {
        Object.keys(companies).forEach(function(company) {
            var currentCost = setNumericalValue(companies[company].cost);
            companies[company].runButton.addEventListener('click', function() {
                if(!companies[company].isRunning && companies[company].owned > 0) {
                    companies[company].isRunning = true;
                }
            });
            companies[company].buyButton.addEventListener('click', handleAdditionalPurchase);
            companies[company].initialBuyButton.addEventListener('click', handleInitialPurchase);
            if(companies[company].owned > 0) {
                document.getElementById(companies[company].name + 'UnpurchasedElement').classList.add('capitalism-now-puchased');
                document.getElementById(companies[company].name + 'PurchasedElement').classList.remove('capitalism-awaiting-purchase');
            }
            setCurrentEarnings(companies[company]);
            setDisplayCosts(companies[company]);
            companies[company].ownedElement.innerText = companies[company].owned;
        });
    }

    function softReset() {
        money = 0;
        savedAngels += newAngels;
        var displayAngels = setNumericalValue(savedAngels);
        savedAngelsElement.innerText = displayAngels.displayValue + ' ' + displayAngels.displayName;
        newAngelsElement.innerText = '0';
        newAngels = 0;
        for(var i = usedUpgrades.length - 1; i >= 0; i--) {
            usedUpgrades[i].forEach(function(upgrade) {
                console.log(upgrade);
                upgrades.unshift(upgrade);
            });
        }
        Object.keys(usedUnlocks).forEach(function(key) {
            for(var i = usedUnlocks[key].length - 1; i >= 0; i--) {
                for(var j = usedUnlocks[key][i].length - 1; j >= 0; j--) {
                    unlocks[key].unshift(usedUnlocks[key][i][j]);
                }
            }
        });
        usedUnlocks = {lemon: [], news: [], carwash: [], pizza: [], donut: [], shrimp: [], hockey: [], studio: [], bank: [], oil: [], super: []};
        usedUpgrades = [];
        Object.keys(companies).forEach(function(key) {
            companies[key].owned = key !== 'lemon' ? 0 : 1;
            companies[key].earnings = companies[key].initialEarnings;
            companies[key].duration = companies[key].initialDuration;
            companies[key].hasManager = false;
            companies[key].isRunning = false;
            companies[key].moneySpent = 0;
            document.getElementById(key + 'ManagerWrapper').classList.remove('capitalism-now-puchased');
            setCurrentEarnings(companies[key]);
            setDisplayCosts(companies[key]);
            companies[key].ownedElement.innerText = companies[key].owned;
        });
        document.getElementById('mainAchievementsText').innerText = '0';
        setAcheivementElements();
        setUpgradeElements();
    }

    function handleInitialPurchase() {
        if(money > companies[this.dataset.company].initialCost && companies[this.dataset.company].owned === 0) {
            var currentlyOwned = 0;
            document.getElementById(companies[this.dataset.company].name + 'UnpurchasedElement').classList.add('capitalism-now-puchased');
            document.getElementById(companies[this.dataset.company].name + 'PurchasedElement').classList.remove('capitalism-awaiting-purchase');
            companies[this.dataset.company].owned++;
            companies[this.dataset.company].ownedElement.innerText = '1';
            money -= companies[this.dataset.company].initialCost;
            companies[this.dataset.company].moneySpent += companies[this.dataset.company].initialCost;
            if(currentPurchaseOption === 'Max') {
                setMaximumValues(companies[this.dataset.company]);
            } else {
                setDisplayCosts(companies[this.dataset.company]);
            }
            setCurrentEarnings(companies[this.dataset.company]);
            checkUnlocks(companies[this.dataset.company]);
            Object.keys(companies).forEach(function(company) {
                if(companies[company].owned > 0) {
                    currentlyOwned++;
                }
            });
            allCompaniesPurchased = currentlyOwned === Object.keys(companies).length;
        }
    }

    function handleAdditionalPurchase() {
        var company = companies[this.dataset.company];
        var currentCost;
        var amount;
        if(currentPurchaseOption === 'Max') {
            var max = findMaximumPurchasable(company);
            amount = max.amount;
            currentCost = max.cost;
        } else {
            currentCost = calculateCost(company, currentPurchaseOption);
            amount = currentPurchaseOption;
        }
        if(currentCost < money && currentCost > 0) {
            company.owned += amount;
            company.ownedElement.innerText = company.owned;
            money -= currentCost;
            company.moneySpent += currentCost;
            if(currentPurchaseOption === 'Max') {
                setMaximumValues(company);
            } else {
                setDisplayCosts(company);
            }
            checkUnlocks(company);
            checkSuperUnlocks();
            setCurrentEarnings(company);
        }
    }

    function purchaseUpgrade() {
        if(!this.classList.contains('capitalism-unavailable-option') && money > this.dataset.cost) {
            if(this.dataset.company === 'all') {
                var self = this;
                Object.keys(companies).forEach(function(company) {
                    companies[company].earnings *= self.dataset.multiplier;
                    setCurrentEarnings(companies[company]);
                });
            } else if(this.dataset.company === 'angel') {
                console.log('hallelujah');
            } else {
                companies[this.dataset.company].earnings *= this.dataset.multiplier;
                money -= this.dataset.cost;
                setCurrentEarnings(companies[this.dataset.company]);
            }
            usedUpgrades.push(upgrades.splice(this.dataset.index, 1));
            setUpgradeElements();
        }
    }

    function setCurrentEarnings(company) {
        if(company.owned > 0) {
            var earnings = company.earnings * company.owned;
            if(savedAngels > 0) {
                earnings *= (savedAngels * (angelsBonus / 100));
            }
            earnings = setNumericalValue(earnings);
            if(earnings.displayName.length === 0) {
                company.earningsElement.innerText = '£' + earnings.displayValue;
            } else {
                company.earningsElement.innerText = '£' + earnings.displayValue + '\n' + earnings.displayName;
            }
        }
    }

    function setNumericalValue(value) {
        var valueString = value.toString();
        valueString = valueString.indexOf('e') !== -1 ? valueString : valueString.split('.')[0];
        var position;
        var remainder;
        if(valueString.indexOf('e') !== -1) {
            position = Math.floor(((parseInt(valueString.split('+')[1])) - 6) / 3);
            remainder = parseInt(valueString.split('+')[1]) % 3;
            return {
                displayValue: valueString.indexOf('.') !== -1 ?
                determineValue(valueString, remainder) :
                valueString.split('e')[0] += remainder === 0 ? '' : remainder === 1 ? '0' : '00',
                displayName: numberNames[position]
            };
        } else if(valueString.length > 6) {
            position = Math.floor((valueString.length - 7) / 3);
            var isInHundreds = (valueString.length - 6) % 3 === 0;
            return {
                displayValue: isInHundreds ?
                valueString.substring(0, 3) + '.' + valueString.substring(3, 6) :
                valueString.substring(0, (valueString.length - 6) % 3) + '.' + valueString.substring(((valueString.length - 6) % 3), ((valueString.length - 6) % 3) + 3),
                displayName: numberNames[position]
            };
        } else {
            return {displayValue: valueString, displayName: ''};
        }
    }

    function determineValue(value, remainder) {
        var numbers = value.replace('.', '').split('e')[0];
        if(remainder === 0) {
            return numbers.charAt(0) + '.' + numbers.substring(1, 4);
        } else if(remainder === 1) {
            return numbers.substring(0, 2) + '.' + numbers.substring(2, 5);
        } else {
            return numbers.substring(0, 3) + '.' + numbers.substring(3, 6);
        }
    }

    function calculateNewAngels() {
        newAngels = Math.floor((150 * Math.sqrt(lifetimeEarnings / 1000000000000000))) - savedAngels;
    }

    function renderAngelAmounts() {
        if(frameCount % 30 === 0) {
            var displayAngels = setNumericalValue(newAngels);
            newAngelsElement.innerText = displayAngels.displayValue + ' ' + displayAngels.displayName;
            angelsBonusElement.innerText = angelsBonus.toString();
        }
    }

    function calculateCost(company, numLevels) {
        return ((company.initialCost * (1 - Math.pow(company.coefficient, company.owned + numLevels))) / (1 - company.coefficient)) - ((company.initialCost * (1 - Math.pow(company.coefficient, company.owned))) / (1 - company.coefficient));
    }

    function calculateMoneySpent(company, numLevels) {
        return ((company.initialCost * (1 - Math.pow(company.coefficient, numLevels))) / (1 - company.coefficient));
    }

    function findMaximumPurchasable(company) {
        var max = Math.abs(Math.floor(Math.log(1 + (((company.coefficient - 1) * (money + company.moneySpent)) / company.initialCost)) / Math.log(company.coefficient)) - company.owned);
        if(max === 0) {
            return {cost: calculateCost(company, 1), amount: 1};
        }
        return {cost: calculateCost(company, max), amount: max};
    }

    function setMaximumValues(company) {
        var max = findMaximumPurchasable(company);
        changeBuyIncrementButton.innerText = currentPurchaseOption;
        company.incrementElement.innerText = 'x' + max.amount;
        setDisplayCosts(company, max.cost);
    }

    function updateMaximumValues() {
        if(currentPurchaseOption === 'Max' && frameCount % 10 === 0) {
            Object.keys(companies).forEach(function(company) {
                setMaximumValues(companies[company]);
            });
        }
    }

    function changeBuyIncrements() {
        currentPurchaseOption = availablePurchaseOptions[(availablePurchaseOptions.indexOf(currentPurchaseOption) + 1) % availablePurchaseOptions.length];
        Object.keys(companies).forEach(function(company) {
            if(currentPurchaseOption === 'Max') {
                changeBuyIncrementButton.innerText = currentPurchaseOption;
                setMaximumValues(companies[company]);
            } else {
                changeBuyIncrementButton.innerText = 'x' + currentPurchaseOption;
                companies[company].incrementElement.innerText = 'x' + currentPurchaseOption;
                setDisplayCosts(companies[company]);
            }
        });
    }

    function setDisplayCosts(company, amount) {
        var purchasePrice = amount || calculateCost(company, currentPurchaseOption);
        var currentCost = setNumericalValue(purchasePrice);
        company.costValueElement.innerText = '£' + currentCost.displayValue;
        company.costNameElement.innerText = currentCost.displayName;
    }

    function calculateIsPurchasable() {
        Object.keys(companies).forEach(function(company) {
            var currentPrice = currentPurchaseOption !== 'Max' ? calculateCost(companies[company], currentPurchaseOption) : findMaximumPurchasable(companies[company]).cost;
            if(currentPrice >= money) {
                companies[company].buyButton.classList.add('capitalism-not-buyable');
            } else {
                companies[company].buyButton.classList.remove('capitalism-not-buyable');
            }
        });
    }

    function calculateEarnings() {
        for(var key in companies) {
            if(companies[key].isRunning && companies[key].owned > 0) {
                companies[key].currentTime += deltaTime;
                if(companies[key].currentTime >= companies[key].duration / baseSpeed) {
                    var durationReachedTimes = Math.floor(companies[key].currentTime / (companies[key].duration / baseSpeed));
                    var cycleEarnings = companies[key].earnings * companies[key].owned * durationReachedTimes;
                    if(savedAngels > 0) {
                        cycleEarnings *= (savedAngels * (angelsBonus / 100));
                    }
                    money += cycleEarnings;
                    lifetimeEarnings += cycleEarnings;
                    companies[key].currentTime = 0;
                    if(!companies[key].hasManager) {
                        companies[key].isRunning = false;
                    }
                }
            }
        }
    }

    function renderProgress(company) {
        if(company.isRunning) {
            if(company.duration > 0.2) {
                var width = company.canvas.width * company.currentTime / (company.duration / baseSpeed);
                company.ctx.beginPath();
                company.ctx.fillRect(0, 0, width, company.canvas.height);
            } else {
                company.ctx.beginPath();
                company.ctx.fillRect(0, 0, company.canvas.width, company.canvas.height);
                for(var i = 0; i < 10; i++) {
                    company.ctx.beginPath();
                    company.ctx.moveTo((oneFifthCanvasWidth * i) + progressInnerBarIncrement, 0);
                    company.ctx.lineTo(((oneFifthCanvasWidth * i) - (oneFifthCanvasWidth * 0.75)) + progressInnerBarIncrement, company.canvas.height);
                    company.ctx.stroke();
                }
            }
        }
    }

    function updateProgressBarIncrement() {
        progressInnerBarIncrement++;
        if(progressInnerBarIncrement > oneFifthCanvasWidth) {
            progressInnerBarIncrement = 0;
        }
    }

    function renderTimer(company) {
        var text = company.isRunning ? toMinutesAndSeconds((company.duration / baseSpeed) - company.currentTime) : '0:00';
        company.timer.innerText = text;
    }

    function renderMoney() {
        var displayMoney = setNumericalValue(money);
        document.getElementById('money').innerText = '£' + displayMoney.displayValue + ' ' + displayMoney.displayName;
    }

    function setDeltaTime(time) {
        deltaTime = (time - lastTime) / 1000;
        lastTime = time;
    }

    function clearCanvases() {
        for(var key in companies) {
            clearCanvas(companies[key]);
        }
    }

    function renderProgresses() {
        for(var key in companies) {
            renderProgress(companies[key]);
        }
    }

    function renderTimers() {
        if(frameCount % 10 === 0) {
            for(var key in companies) {
                renderTimer(companies[key]);
            }
        }
    }

    function checkManagerAvailablility() {
        if(frameCount % 60 === 1) {
            buyManagerButtons.forEach(function(buyManagerButton) {
                if(money >= buyManagerButton.dataset.cost) {
                    buyManagerButton.classList.remove('capitalism-unavailable-option');
                } else if(!buyManagerButton.classList.contains('capitalism-unavailable-option')) {
                    buyManagerButton.classList.add('capitalism-unavailable-option');
                }
            });
        }
    }

    function checkUpgradeAvailablility() {
        if(frameCount % 60 === 1) {
            upgradeElements.forEach(function(upgradeElement) {
                    var button = document.getElementById(upgradeElement.dataset.button);
                    if(button !== null) {
                        if(money >= button.dataset.cost) {
                            button.classList.remove('capitalism-unavailable-option');
                        } else if(!button.classList.contains('capitalism-unavailable-option')) {
                            button.classList.add('capitalism-unavailable-option');
                        }
                    }
            });
        }
    }

    function checkUnlocks(company) {
        var count = 0;
        for(var i = 0; i < unlocks[company.name].length; i++) {
            if(company.owned >= unlocks[company.name][i].a) {
                if(typeof unlocks[company.name][i].c !== 'undefined') {
                    companies[unlocks[company.name][i].c].earnings *= unlocks[company.name][i].m;
                    displayUnlockNotice(unlocks[company.name][i], unlocks[company.name][i].c);
                } else if(unlocks[company.name][i].t === 'speed') {
                    company.duration /= unlocks[company.name][i].m;
                    displayUnlockNotice(unlocks[company.name][i], company.name);
                } else {
                    company.earnings *= unlocks[company.name][i].m;
                    displayUnlockNotice(unlocks[company.name][i], company.name);
                }
                count++;
            } else {
                break;
            }
        }
        if(count > 0) {
            var countSoFar = parseInt(document.getElementById('mainAchievementsText').textContent);
            usedUnlocks[company.name].push(unlocks[company.name].splice(0, count));
            document.getElementById(company.name + 'AchievementImage').src = images[company.name];
            document.getElementById(company.name + 'AchievementAmount').innerText = unlocks[company.name][0].a + ' ' + company.name;
            document.getElementById(company.name + 'AchievementReward').innerText = unlocks[company.name][0].t === 'speed' ? 'Speed x' + unlocks[company.name][0].m : 'Profit x' + unlocks[company.name][0].m;
            document.getElementById('mainAchievementsText').innerText = (countSoFar + count).toString();
        }
    }

    function checkSuperUnlocks() {
        var count = 0;
        for(var i = 0; i < unlocks.super.length; i++) {
            var hasCorrectAmountofEach = true;
            Object.keys(companies).forEach(function(company) {
                if(companies[company].owned < unlocks.super[i].a) {
                    hasCorrectAmountofEach = false;
                }
            });
            if(hasCorrectAmountofEach) {
                if(unlocks.super[i].t === 'speed') {
                    Object.keys(companies).forEach(function(company) {
                        companies[company].duration /= unlocks.super[i].m;
                    });
                } else if(unlocks.super[i].t === 'profit') {
                    Object.keys(companies).forEach(function(company) {
                        companies[company].earnings *= unlocks.super[i].m;
                    });
                }
                count++;
                displayUnlockNotice(unlocks.super[i], 'all');
            } else {
                break;
            }
        }
        if(count > 0) {
            var countSoFar = parseInt(document.getElementById('mainAchievementsText').textContent);
            usedUnlocks.super.push(unlocks.super.splice(0, count));
            document.getElementById('superAchievementImage').src = images.all;
            document.getElementById('superAchievementAmount').innerText = unlocks.super[0].a + ' ' + 'of everything';
            document.getElementById('superAchievementReward').innerText = unlocks.super[0].t === 'speed' ? 'Speed x' + unlocks.super[0].m : 'Profit x' + unlocks.super[0].m;
            document.getElementById('mainAchievementsText').innerText = (countSoFar + count).toString();
        }
    }

    function displayUnlockNotice(unlock, companyName) {
        var text = unlock.t === 'speed' ? 'Speed of ' : 'Profit of ';
        unlockNotice.classList.add('capitalism-unlock-notice-displayed');
        if(typeof unlock.c !== 'undefined') {
            unlockNoticeImage.src = images[unlock.c];
            unlockNoticeText.innerText = text + companyName + ' increased by ' + unlock.m;
        } else {
            unlockNoticeImage.src = images[companyName];
            unlockNoticeText.innerText = text + companyName + ' increased by ' + unlock.m;
        }
        unlockMessageTimer.isRunning = true;
        unlockMessageTimer.time = 0;
    }

    function updateUnlockMessageTimer() {
        if(unlockMessageTimer.isRunning) {
            unlockMessageTimer.time += deltaTime;
            if(unlockMessageTimer.time >= unlockMessageTimer.displayTime) {
                unlockNotice.classList.remove('capitalism-unlock-notice-displayed');
            }
        }
    }

    function checkInitialPurchaseAvailablity() {
        if(!allCompaniesPurchased) {
            Object.keys(companies).forEach(function(company) {
                if(money > companies[company].initialCost) {
                    companies[company].initialBuyButton.classList.remove('capitalism-not-buyable');
                } else {
                    companies[company].initialBuyButton.classList.add('capitalism-not-buyable');
                }
            });
        }
    }

    function clearCanvas(company) {
        company.ctx.clearRect(0, 0, company.canvas.width, company.canvas.height);
    }

    function saveManagement() {
        if(frameCount % 1000 === 0) {
            saveGame();
        }
    }

    function saveGame() {
        var saveState = {
            companies: {},
            money: money,
            unlocks: {},
            upgrades: upgrades.length,
            dateTime: Date.now()
        };
        Object.keys(companies).forEach(function(key) {
            saveState.companies[key] = {
                owned: companies[key].owned,
                earnings:  companies[key].earnings,
                duration:  companies[key].duration,
                hasManager:  companies[key].hasManager,
                isRunning:  companies[key].isRunning
            };
        });
        Object.keys(unlocks).forEach(function(unlock) {
            saveState.unlocks[unlock] = unlocks[unlock].length;
        });
        storage.setItem('capitalism', JSON.stringify(saveState));
    }

    function calculateIdleEarning(dateTime) {
        var idleTimeInSeconds = (Date.now() - dateTime) / 1000;
        var idleEarnings = 0;
        Object.keys(companies).forEach(function(key) {
            idleEarnings += Math.floor(idleTimeInSeconds / companies[key].duration) * (companies[key].owned * companies[key].earnings);
        });
        money += idleEarnings;
        var dislayEarnings = setNumericalValue(idleEarnings);
        document.getElementById('capitalismIdleTime').innerText = 'You were offline for ' + toMinutesAndSeconds(idleTimeInSeconds);
        document.getElementById('capitalismIdleEarnings').innerText = 'You earned £' + dislayEarnings.displayValue + ' ' + dislayEarnings.displayName + ' whilst you were away!';
    }

    function setAcheivementElements() {
        Object.keys(unlocks).forEach(function(key) {
            var imageNeeded = key === 'super' ? 'all' : key;
            document.getElementById(key + 'AchievementImage').src = images[imageNeeded];
            document.getElementById(key + 'AchievementAmount').innerText = unlocks[key][0].a + ' ' + key;
            document.getElementById(key + 'AchievementReward').innerText = unlocks[key][0].t === 'speed' ? 'Speed x' + unlocks[key][0].m : 'Profit x' + unlocks[key][0].m;
        });
    }


    function loadGame() {
        linkCompanyElements();
        var saveState = storage.getItem('capitalism');
        if(saveState !== null) {
            var achievedTotal = 0;
            saveState = JSON.parse(saveState);
            Object.keys(saveState.companies).forEach(function(key) {
                companies[key].owned = saveState.companies[key].owned;
                companies[key].earnings = saveState.companies[key].earnings;
                companies[key].duration = saveState.companies[key].duration;
                companies[key].hasManager = saveState.companies[key].hasManager;
                companies[key].isRunning = saveState.companies[key].isRunning;
                companies[key].moneySpent = calculateMoneySpent(companies[key], companies[key].owned);
            });
            Object.keys(saveState.unlocks).forEach(function(key) {
                achievedTotal += unlocks[key].length - saveState.unlocks[key];
                unlocks[key].splice(0, unlocks[key].length - saveState.unlocks[key]);
            });
            document.getElementById('mainAchievementsText').innerText = achievedTotal;
            Object.keys(companies).forEach(function(key) {
                if(companies[key].hasManager) {
                    document.getElementById(key + 'ManagerWrapper').remove();
                }
            });
            money = saveState.money;
            upgrades.splice(0, upgrades.length - saveState.upgrades);
            calculateIdleEarning(saveState.dateTime);
            capitalismPlayButton.innerText = 'Continue';
        } else {
            document.getElementById('capitalismInitialStartMessage').innerText = 'Click start to play!';
        }
        setup();
        setAcheivementElements();
        setUpgradeElements();
        document.getElementById('capitalismLoadingMessage').classList.add('capitalism-now-loaded');
        document.getElementById('capitalismLoadingWrapper').classList.remove('capitalism-is-loading');
    }


    loadGame();

    function main(time) {
        frameCount++;
        setDeltaTime(time);
        clearCanvases();
        calculateEarnings();
        calculateNewAngels();
        calculateIsPurchasable();
        updateMaximumValues();
        updateUnlockMessageTimer();
        renderMoney();
        renderAngelAmounts();
        updateProgressBarIncrement();
        renderProgresses();
        checkInitialPurchaseAvailablity();
        checkManagerAvailablility();
        checkUpgradeAvailablility();
        renderTimers();
        saveManagement();
        requestAnimationFrame(main);
    }

    animation = requestAnimationFrame(main);

    playButton.addEventListener('click', function() {
        var el = document.getElementById('capitalismFullScreen');
        var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        try {
            rfs.call(el);
        } catch(error) {
            console.log('no full screen');
        }
        document.getElementById('capitalismLandingPage').classList.add('capitalism-landing-page-closed');
    });


    function toMinutesAndSeconds(timeInSeconds) {
        var minutes = (Math.floor(timeInSeconds / 60));
        var seconds = (Math.floor(timeInSeconds % 60)).toString();
        seconds = seconds.length === 1 ? '0' + seconds : seconds;
        if(minutes >= 60) {
            var hours = Math.floor(minutes / 60);
            minutes = (minutes % 60).toString();
            minutes = minutes.length === 1 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ':' + seconds;
        }
        return minutes + ':' + seconds;
    }

    window.addEventListener('resize', function() {
        if(window.innerWidth < window.innerHeight) {
            console.log('it happended');
            rotateScreen.classList.remove('capitalism-no-display');
        } else if(!rotateScreen.classList.contains('capitalism-no-display')) {
            rotateScreen.classList.add('capitalism-no-display');
        }
    });

})();
