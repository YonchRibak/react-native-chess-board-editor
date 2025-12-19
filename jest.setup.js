// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;

  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Gesture: {
      Pan: () => ({
        enabled: jest.fn().mockReturnThis(),
        onStart: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      }),
    },
    PanGestureHandler: View,
    State: {},
    Directions: {},
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;

  const Reanimated = {
    default: {
      View,
      ScrollView: require('react-native').ScrollView,
      Image: require('react-native').Image,
      Text: require('react-native').Text,
      createAnimatedComponent: (component) => component,
    },
    View,
    ScrollView: require('react-native').ScrollView,
    Image: require('react-native').Image,
    Text: require('react-native').Text,

    // Hooks
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn((callback) => callback()),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    useDerivedValue: jest.fn((callback) => ({ value: callback() })),
    useAnimatedProps: jest.fn(() => ({})),
    useAnimatedReaction: jest.fn(),

    // Animations
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    withDecay: jest.fn((value) => value),
    withDelay: jest.fn((_, value) => value),
    withSequence: jest.fn((...values) => values[0]),
    withRepeat: jest.fn((value) => value),

    // Utilities
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    cancelAnimation: jest.fn(),
    measure: jest.fn(),
    scrollTo: jest.fn(),

    // Easing
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },

    // Other
    Extrapolate: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
  };

  return Reanimated;
});
