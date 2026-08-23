// AUTO-GENERATED from "Stickerverse USA Prices.xlsx" — do not edit by hand.
// Regenerate with: node gen-pricing.js <xlsx> lib/pricing-data.ts
// Prices are cost per sticker in USD. "qty" is the tier minimum quantity.
// "contour" = Contour Cut (die cut), "kiss" = Kiss Cut.

export type QtyBreak = { qty: number; price: number };
export type CutTables = { contour: QtyBreak[]; kiss?: QtyBreak[] };
export type SizeTables = Record<string, CutTables>;

export const PRICING: Record<string, SizeTables> = {
  "economy-vinyl": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 0.82
        },
        {
          "qty": 25,
          "price": 0.82
        },
        {
          "qty": 50,
          "price": 0.82
        },
        {
          "qty": 100,
          "price": 0.53
        },
        {
          "qty": 200,
          "price": 0.38
        },
        {
          "qty": 300,
          "price": 0.32
        },
        {
          "qty": 500,
          "price": 0.26
        },
        {
          "qty": 1000,
          "price": 0.21
        },
        {
          "qty": 2000,
          "price": 0.16
        },
        {
          "qty": 3000,
          "price": 0.14
        },
        {
          "qty": 4000,
          "price": 0.14
        },
        {
          "qty": 5000,
          "price": 0.12
        },
        {
          "qty": 10000,
          "price": 0.12
        },
        {
          "qty": 11000,
          "price": 0.11
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 0.86
        },
        {
          "qty": 25,
          "price": 0.86
        },
        {
          "qty": 50,
          "price": 0.86
        },
        {
          "qty": 100,
          "price": 0.56
        },
        {
          "qty": 200,
          "price": 0.4
        },
        {
          "qty": 300,
          "price": 0.34
        },
        {
          "qty": 500,
          "price": 0.28
        },
        {
          "qty": 1000,
          "price": 0.22
        },
        {
          "qty": 2000,
          "price": 0.17
        },
        {
          "qty": 3000,
          "price": 0.15
        },
        {
          "qty": 4000,
          "price": 0.15
        },
        {
          "qty": 5000,
          "price": 0.13
        },
        {
          "qty": 10000,
          "price": 0.13
        },
        {
          "qty": 11000,
          "price": 0.12
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 0.94
        },
        {
          "qty": 25,
          "price": 0.94
        },
        {
          "qty": 50,
          "price": 0.94
        },
        {
          "qty": 100,
          "price": 0.61
        },
        {
          "qty": 200,
          "price": 0.43
        },
        {
          "qty": 300,
          "price": 0.37
        },
        {
          "qty": 500,
          "price": 0.3
        },
        {
          "qty": 1000,
          "price": 0.25
        },
        {
          "qty": 2000,
          "price": 0.18
        },
        {
          "qty": 3000,
          "price": 0.16
        },
        {
          "qty": 4000,
          "price": 0.16
        },
        {
          "qty": 5000,
          "price": 0.14
        },
        {
          "qty": 6000,
          "price": 0.14
        },
        {
          "qty": 10000,
          "price": 0.13
        },
        {
          "qty": 11000,
          "price": 0.12
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 0.99
        },
        {
          "qty": 25,
          "price": 0.99
        },
        {
          "qty": 50,
          "price": 0.99
        },
        {
          "qty": 100,
          "price": 0.64
        },
        {
          "qty": 200,
          "price": 0.46
        },
        {
          "qty": 300,
          "price": 0.39
        },
        {
          "qty": 500,
          "price": 0.32
        },
        {
          "qty": 1000,
          "price": 0.26
        },
        {
          "qty": 2000,
          "price": 0.19
        },
        {
          "qty": 3000,
          "price": 0.17
        },
        {
          "qty": 4000,
          "price": 0.17
        },
        {
          "qty": 5000,
          "price": 0.15
        },
        {
          "qty": 6000,
          "price": 0.15
        },
        {
          "qty": 10000,
          "price": 0.14
        },
        {
          "qty": 11000,
          "price": 0.13
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.13
        },
        {
          "qty": 25,
          "price": 1.13
        },
        {
          "qty": 50,
          "price": 1.13
        },
        {
          "qty": 100,
          "price": 0.79
        },
        {
          "qty": 200,
          "price": 0.6
        },
        {
          "qty": 300,
          "price": 0.52
        },
        {
          "qty": 500,
          "price": 0.44
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.31
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 10000,
          "price": 0.23
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.19
        },
        {
          "qty": 25,
          "price": 1.19
        },
        {
          "qty": 50,
          "price": 1.19
        },
        {
          "qty": 100,
          "price": 0.83
        },
        {
          "qty": 200,
          "price": 0.63
        },
        {
          "qty": 300,
          "price": 0.55
        },
        {
          "qty": 500,
          "price": 0.46
        },
        {
          "qty": 1000,
          "price": 0.39
        },
        {
          "qty": 2000,
          "price": 0.32
        },
        {
          "qty": 3000,
          "price": 0.27
        },
        {
          "qty": 4000,
          "price": 0.27
        },
        {
          "qty": 5000,
          "price": 0.25
        },
        {
          "qty": 6000,
          "price": 0.24
        },
        {
          "qty": 8000,
          "price": 0.21
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 1.34
        },
        {
          "qty": 25,
          "price": 1.34
        },
        {
          "qty": 50,
          "price": 1.34
        },
        {
          "qty": 100,
          "price": 1
        },
        {
          "qty": 200,
          "price": 0.8
        },
        {
          "qty": 300,
          "price": 0.71
        },
        {
          "qty": 500,
          "price": 0.63
        },
        {
          "qty": 1000,
          "price": 0.53
        },
        {
          "qty": 2000,
          "price": 0.44
        },
        {
          "qty": 3000,
          "price": 0.41
        },
        {
          "qty": 4000,
          "price": 0.41
        },
        {
          "qty": 5000,
          "price": 0.37
        },
        {
          "qty": 10000,
          "price": 0.36
        },
        {
          "qty": 11000,
          "price": 0.35
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.4
        },
        {
          "qty": 25,
          "price": 1.4
        },
        {
          "qty": 50,
          "price": 1.4
        },
        {
          "qty": 100,
          "price": 1.05
        },
        {
          "qty": 200,
          "price": 0.84
        },
        {
          "qty": 300,
          "price": 0.74
        },
        {
          "qty": 500,
          "price": 0.66
        },
        {
          "qty": 1000,
          "price": 0.56
        },
        {
          "qty": 2000,
          "price": 0.46
        },
        {
          "qty": 3000,
          "price": 0.44
        },
        {
          "qty": 4000,
          "price": 0.44
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.37
        }
      ]
    }
  },
  "premium-vinyl": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.17
        },
        {
          "qty": 25,
          "price": 1.17
        },
        {
          "qty": 50,
          "price": 1.17
        },
        {
          "qty": 100,
          "price": 0.76
        },
        {
          "qty": 200,
          "price": 0.54
        },
        {
          "qty": 300,
          "price": 0.46
        },
        {
          "qty": 500,
          "price": 0.37
        },
        {
          "qty": 1000,
          "price": 0.3
        },
        {
          "qty": 2000,
          "price": 0.23
        },
        {
          "qty": 3000,
          "price": 0.2
        },
        {
          "qty": 4000,
          "price": 0.2
        },
        {
          "qty": 5000,
          "price": 0.18
        },
        {
          "qty": 10000,
          "price": 0.17
        },
        {
          "qty": 11000,
          "price": 0.15
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.23
        },
        {
          "qty": 25,
          "price": 1.23
        },
        {
          "qty": 50,
          "price": 1.23
        },
        {
          "qty": 100,
          "price": 0.8
        },
        {
          "qty": 200,
          "price": 0.57
        },
        {
          "qty": 300,
          "price": 0.48
        },
        {
          "qty": 500,
          "price": 0.39
        },
        {
          "qty": 1000,
          "price": 0.32
        },
        {
          "qty": 2000,
          "price": 0.24
        },
        {
          "qty": 3000,
          "price": 0.21
        },
        {
          "qty": 4000,
          "price": 0.21
        },
        {
          "qty": 5000,
          "price": 0.19
        },
        {
          "qty": 10000,
          "price": 0.18
        },
        {
          "qty": 11000,
          "price": 0.16
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.35
        },
        {
          "qty": 25,
          "price": 1.35
        },
        {
          "qty": 50,
          "price": 1.35
        },
        {
          "qty": 100,
          "price": 0.88
        },
        {
          "qty": 200,
          "price": 0.62
        },
        {
          "qty": 300,
          "price": 0.53
        },
        {
          "qty": 500,
          "price": 0.43
        },
        {
          "qty": 1000,
          "price": 0.35
        },
        {
          "qty": 2000,
          "price": 0.26
        },
        {
          "qty": 3000,
          "price": 0.23
        },
        {
          "qty": 4000,
          "price": 0.23
        },
        {
          "qty": 5000,
          "price": 0.21
        },
        {
          "qty": 6000,
          "price": 0.2
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 11000,
          "price": 0.18
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.42
        },
        {
          "qty": 25,
          "price": 1.42
        },
        {
          "qty": 50,
          "price": 1.42
        },
        {
          "qty": 100,
          "price": 0.92
        },
        {
          "qty": 200,
          "price": 0.65
        },
        {
          "qty": 300,
          "price": 0.55
        },
        {
          "qty": 500,
          "price": 0.45
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.24
        },
        {
          "qty": 4000,
          "price": 0.24
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 6000,
          "price": 0.21
        },
        {
          "qty": 10000,
          "price": 0.2
        },
        {
          "qty": 11000,
          "price": 0.18
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.62
        },
        {
          "qty": 25,
          "price": 1.62
        },
        {
          "qty": 50,
          "price": 1.62
        },
        {
          "qty": 100,
          "price": 1.13
        },
        {
          "qty": 200,
          "price": 0.86
        },
        {
          "qty": 300,
          "price": 0.75
        },
        {
          "qty": 500,
          "price": 0.63
        },
        {
          "qty": 1000,
          "price": 0.53
        },
        {
          "qty": 2000,
          "price": 0.44
        },
        {
          "qty": 3000,
          "price": 0.37
        },
        {
          "qty": 4000,
          "price": 0.37
        },
        {
          "qty": 5000,
          "price": 0.34
        },
        {
          "qty": 10000,
          "price": 0.32
        },
        {
          "qty": 11000,
          "price": 0.29
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.7
        },
        {
          "qty": 25,
          "price": 1.7
        },
        {
          "qty": 50,
          "price": 1.7
        },
        {
          "qty": 100,
          "price": 1.19
        },
        {
          "qty": 200,
          "price": 0.9
        },
        {
          "qty": 300,
          "price": 0.78
        },
        {
          "qty": 500,
          "price": 0.66
        },
        {
          "qty": 1000,
          "price": 0.56
        },
        {
          "qty": 2000,
          "price": 0.46
        },
        {
          "qty": 3000,
          "price": 0.39
        },
        {
          "qty": 4000,
          "price": 0.39
        },
        {
          "qty": 5000,
          "price": 0.36
        },
        {
          "qty": 6000,
          "price": 0.34
        },
        {
          "qty": 8000,
          "price": 0.31
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 1.91
        },
        {
          "qty": 25,
          "price": 1.91
        },
        {
          "qty": 50,
          "price": 1.91
        },
        {
          "qty": 100,
          "price": 1.43
        },
        {
          "qty": 200,
          "price": 1.15
        },
        {
          "qty": 300,
          "price": 1.01
        },
        {
          "qty": 500,
          "price": 0.9
        },
        {
          "qty": 1000,
          "price": 0.76
        },
        {
          "qty": 2000,
          "price": 0.63
        },
        {
          "qty": 3000,
          "price": 0.59
        },
        {
          "qty": 4000,
          "price": 0.59
        },
        {
          "qty": 5000,
          "price": 0.53
        },
        {
          "qty": 10000,
          "price": 0.51
        },
        {
          "qty": 11000,
          "price": 0.5
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.01
        },
        {
          "qty": 25,
          "price": 2.01
        },
        {
          "qty": 50,
          "price": 2.01
        },
        {
          "qty": 100,
          "price": 1.5
        },
        {
          "qty": 200,
          "price": 1.2
        },
        {
          "qty": 300,
          "price": 1.06
        },
        {
          "qty": 500,
          "price": 0.94
        },
        {
          "qty": 1000,
          "price": 0.8
        },
        {
          "qty": 2000,
          "price": 0.66
        },
        {
          "qty": 3000,
          "price": 0.62
        },
        {
          "qty": 4000,
          "price": 0.62
        },
        {
          "qty": 5000,
          "price": 0.56
        },
        {
          "qty": 10000,
          "price": 0.53
        },
        {
          "qty": 11000,
          "price": 0.52
        }
      ]
    }
  },
  "holographic": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.48
        },
        {
          "qty": 25,
          "price": 1.48
        },
        {
          "qty": 50,
          "price": 1.48
        },
        {
          "qty": 100,
          "price": 0.68
        },
        {
          "qty": 200,
          "price": 0.61
        },
        {
          "qty": 300,
          "price": 0.58
        },
        {
          "qty": 500,
          "price": 0.47
        },
        {
          "qty": 1000,
          "price": 0.38
        },
        {
          "qty": 2000,
          "price": 0.29
        },
        {
          "qty": 3000,
          "price": 0.25
        },
        {
          "qty": 4000,
          "price": 0.25
        },
        {
          "qty": 5000,
          "price": 0.23
        },
        {
          "qty": 6000,
          "price": 0.22
        },
        {
          "qty": 10000,
          "price": 0.21
        },
        {
          "qty": 11000,
          "price": 0.19
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.55
        },
        {
          "qty": 25,
          "price": 1.55
        },
        {
          "qty": 50,
          "price": 1.55
        },
        {
          "qty": 100,
          "price": 1.01
        },
        {
          "qty": 200,
          "price": 0.71
        },
        {
          "qty": 300,
          "price": 0.61
        },
        {
          "qty": 500,
          "price": 0.5
        },
        {
          "qty": 1000,
          "price": 0.4
        },
        {
          "qty": 2000,
          "price": 0.3
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 6000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.71
        },
        {
          "qty": 25,
          "price": 1.71
        },
        {
          "qty": 50,
          "price": 1.71
        },
        {
          "qty": 100,
          "price": 1.11
        },
        {
          "qty": 200,
          "price": 0.79
        },
        {
          "qty": 300,
          "price": 0.67
        },
        {
          "qty": 500,
          "price": 0.55
        },
        {
          "qty": 1000,
          "price": 0.44
        },
        {
          "qty": 2000,
          "price": 0.33
        },
        {
          "qty": 3000,
          "price": 0.29
        },
        {
          "qty": 4000,
          "price": 0.29
        },
        {
          "qty": 5000,
          "price": 0.26
        },
        {
          "qty": 10000,
          "price": 0.24
        },
        {
          "qty": 11000,
          "price": 0.22
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.79
        },
        {
          "qty": 25,
          "price": 1.79
        },
        {
          "qty": 50,
          "price": 1.79
        },
        {
          "qty": 100,
          "price": 1.17
        },
        {
          "qty": 200,
          "price": 0.82
        },
        {
          "qty": 300,
          "price": 0.7
        },
        {
          "qty": 500,
          "price": 0.57
        },
        {
          "qty": 1000,
          "price": 0.47
        },
        {
          "qty": 2000,
          "price": 0.35
        },
        {
          "qty": 3000,
          "price": 0.3
        },
        {
          "qty": 4000,
          "price": 0.3
        },
        {
          "qty": 6000,
          "price": 0.27
        },
        {
          "qty": 10000,
          "price": 0.26
        },
        {
          "qty": 11000,
          "price": 0.23
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 2.05
        },
        {
          "qty": 25,
          "price": 2.05
        },
        {
          "qty": 50,
          "price": 2.05
        },
        {
          "qty": 100,
          "price": 1.43
        },
        {
          "qty": 200,
          "price": 1.09
        },
        {
          "qty": 300,
          "price": 0.94
        },
        {
          "qty": 500,
          "price": 0.8
        },
        {
          "qty": 1000,
          "price": 0.68
        },
        {
          "qty": 2000,
          "price": 0.55
        },
        {
          "qty": 3000,
          "price": 0.47
        },
        {
          "qty": 4000,
          "price": 0.47
        },
        {
          "qty": 5000,
          "price": 0.43
        },
        {
          "qty": 10000,
          "price": 0.41
        },
        {
          "qty": 11000,
          "price": 0.37
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.15
        },
        {
          "qty": 25,
          "price": 2.15
        },
        {
          "qty": 50,
          "price": 2.15
        },
        {
          "qty": 100,
          "price": 1.51
        },
        {
          "qty": 200,
          "price": 1.14
        },
        {
          "qty": 300,
          "price": 0.99
        },
        {
          "qty": 500,
          "price": 0.84
        },
        {
          "qty": 1000,
          "price": 0.71
        },
        {
          "qty": 2000,
          "price": 0.58
        },
        {
          "qty": 3000,
          "price": 0.49
        },
        {
          "qty": 4000,
          "price": 0.49
        },
        {
          "qty": 5000,
          "price": 0.45
        },
        {
          "qty": 6000,
          "price": 0.43
        },
        {
          "qty": 8000,
          "price": 0.39
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.2
        },
        {
          "qty": 25,
          "price": 2.2
        },
        {
          "qty": 50,
          "price": 2.2
        },
        {
          "qty": 100,
          "price": 1.65
        },
        {
          "qty": 200,
          "price": 1.32
        },
        {
          "qty": 300,
          "price": 1.16
        },
        {
          "qty": 500,
          "price": 1.03
        },
        {
          "qty": 1000,
          "price": 0.88
        },
        {
          "qty": 2000,
          "price": 0.72
        },
        {
          "qty": 3000,
          "price": 0.68
        },
        {
          "qty": 4000,
          "price": 0.68
        },
        {
          "qty": 5000,
          "price": 0.62
        },
        {
          "qty": 10000,
          "price": 0.58
        },
        {
          "qty": 11000,
          "price": 0.57
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.54
        },
        {
          "qty": 25,
          "price": 2.54
        },
        {
          "qty": 50,
          "price": 2.54
        },
        {
          "qty": 100,
          "price": 1.9
        },
        {
          "qty": 200,
          "price": 1.52
        },
        {
          "qty": 300,
          "price": 1.34
        },
        {
          "qty": 500,
          "price": 1.19
        },
        {
          "qty": 1000,
          "price": 1.01
        },
        {
          "qty": 2000,
          "price": 0.84
        },
        {
          "qty": 3000,
          "price": 0.79
        },
        {
          "qty": 4000,
          "price": 0.79
        },
        {
          "qty": 5000,
          "price": 0.71
        },
        {
          "qty": 6000,
          "price": 0.67
        },
        {
          "qty": 8000,
          "price": 0.66
        }
      ]
    }
  },
  "chrome": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.48
        },
        {
          "qty": 25,
          "price": 1.48
        },
        {
          "qty": 50,
          "price": 1.48
        },
        {
          "qty": 100,
          "price": 0.68
        },
        {
          "qty": 200,
          "price": 0.61
        },
        {
          "qty": 300,
          "price": 0.58
        },
        {
          "qty": 500,
          "price": 0.47
        },
        {
          "qty": 1000,
          "price": 0.38
        },
        {
          "qty": 2000,
          "price": 0.29
        },
        {
          "qty": 3000,
          "price": 0.25
        },
        {
          "qty": 4000,
          "price": 0.25
        },
        {
          "qty": 5000,
          "price": 0.23
        },
        {
          "qty": 6000,
          "price": 0.22
        },
        {
          "qty": 10000,
          "price": 0.21
        },
        {
          "qty": 11000,
          "price": 0.19
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.55
        },
        {
          "qty": 25,
          "price": 1.55
        },
        {
          "qty": 50,
          "price": 1.55
        },
        {
          "qty": 100,
          "price": 1.01
        },
        {
          "qty": 200,
          "price": 0.71
        },
        {
          "qty": 300,
          "price": 0.61
        },
        {
          "qty": 500,
          "price": 0.5
        },
        {
          "qty": 1000,
          "price": 0.4
        },
        {
          "qty": 2000,
          "price": 0.3
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 6000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.71
        },
        {
          "qty": 25,
          "price": 1.71
        },
        {
          "qty": 50,
          "price": 1.71
        },
        {
          "qty": 100,
          "price": 1.11
        },
        {
          "qty": 200,
          "price": 0.79
        },
        {
          "qty": 300,
          "price": 0.67
        },
        {
          "qty": 500,
          "price": 0.55
        },
        {
          "qty": 1000,
          "price": 0.44
        },
        {
          "qty": 2000,
          "price": 0.33
        },
        {
          "qty": 3000,
          "price": 0.29
        },
        {
          "qty": 4000,
          "price": 0.29
        },
        {
          "qty": 5000,
          "price": 0.26
        },
        {
          "qty": 10000,
          "price": 0.24
        },
        {
          "qty": 11000,
          "price": 0.22
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.79
        },
        {
          "qty": 25,
          "price": 1.79
        },
        {
          "qty": 50,
          "price": 1.79
        },
        {
          "qty": 100,
          "price": 1.17
        },
        {
          "qty": 200,
          "price": 0.82
        },
        {
          "qty": 300,
          "price": 0.7
        },
        {
          "qty": 500,
          "price": 0.57
        },
        {
          "qty": 1000,
          "price": 0.47
        },
        {
          "qty": 2000,
          "price": 0.35
        },
        {
          "qty": 3000,
          "price": 0.3
        },
        {
          "qty": 4000,
          "price": 0.3
        },
        {
          "qty": 6000,
          "price": 0.27
        },
        {
          "qty": 10000,
          "price": 0.26
        },
        {
          "qty": 11000,
          "price": 0.23
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 2.05
        },
        {
          "qty": 25,
          "price": 2.05
        },
        {
          "qty": 50,
          "price": 2.05
        },
        {
          "qty": 100,
          "price": 1.43
        },
        {
          "qty": 200,
          "price": 1.09
        },
        {
          "qty": 300,
          "price": 0.94
        },
        {
          "qty": 500,
          "price": 0.8
        },
        {
          "qty": 1000,
          "price": 0.68
        },
        {
          "qty": 2000,
          "price": 0.55
        },
        {
          "qty": 3000,
          "price": 0.47
        },
        {
          "qty": 4000,
          "price": 0.47
        },
        {
          "qty": 5000,
          "price": 0.43
        },
        {
          "qty": 10000,
          "price": 0.41
        },
        {
          "qty": 11000,
          "price": 0.37
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.15
        },
        {
          "qty": 25,
          "price": 2.15
        },
        {
          "qty": 50,
          "price": 2.15
        },
        {
          "qty": 100,
          "price": 1.51
        },
        {
          "qty": 200,
          "price": 1.14
        },
        {
          "qty": 300,
          "price": 0.99
        },
        {
          "qty": 500,
          "price": 0.84
        },
        {
          "qty": 1000,
          "price": 0.71
        },
        {
          "qty": 2000,
          "price": 0.58
        },
        {
          "qty": 3000,
          "price": 0.49
        },
        {
          "qty": 4000,
          "price": 0.49
        },
        {
          "qty": 5000,
          "price": 0.45
        },
        {
          "qty": 6000,
          "price": 0.43
        },
        {
          "qty": 8000,
          "price": 0.39
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.2
        },
        {
          "qty": 25,
          "price": 2.2
        },
        {
          "qty": 50,
          "price": 2.2
        },
        {
          "qty": 100,
          "price": 1.65
        },
        {
          "qty": 200,
          "price": 1.32
        },
        {
          "qty": 300,
          "price": 1.16
        },
        {
          "qty": 500,
          "price": 1.03
        },
        {
          "qty": 1000,
          "price": 0.88
        },
        {
          "qty": 2000,
          "price": 0.72
        },
        {
          "qty": 3000,
          "price": 0.68
        },
        {
          "qty": 4000,
          "price": 0.68
        },
        {
          "qty": 5000,
          "price": 0.62
        },
        {
          "qty": 10000,
          "price": 0.58
        },
        {
          "qty": 11000,
          "price": 0.57
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.54
        },
        {
          "qty": 25,
          "price": 2.54
        },
        {
          "qty": 50,
          "price": 2.54
        },
        {
          "qty": 100,
          "price": 1.9
        },
        {
          "qty": 200,
          "price": 1.52
        },
        {
          "qty": 300,
          "price": 1.34
        },
        {
          "qty": 500,
          "price": 1.19
        },
        {
          "qty": 1000,
          "price": 1.01
        },
        {
          "qty": 2000,
          "price": 0.84
        },
        {
          "qty": 3000,
          "price": 0.79
        },
        {
          "qty": 4000,
          "price": 0.79
        },
        {
          "qty": 5000,
          "price": 0.71
        },
        {
          "qty": 6000,
          "price": 0.67
        },
        {
          "qty": 8000,
          "price": 0.66
        }
      ]
    }
  },
  "glitter": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.33
        },
        {
          "qty": 25,
          "price": 1.33
        },
        {
          "qty": 50,
          "price": 1.33
        },
        {
          "qty": 100,
          "price": 0.87
        },
        {
          "qty": 200,
          "price": 0.61
        },
        {
          "qty": 300,
          "price": 0.52
        },
        {
          "qty": 500,
          "price": 0.43
        },
        {
          "qty": 1000,
          "price": 0.35
        },
        {
          "qty": 2000,
          "price": 0.26
        },
        {
          "qty": 3000,
          "price": 0.23
        },
        {
          "qty": 4000,
          "price": 0.23
        },
        {
          "qty": 5000,
          "price": 0.21
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 11000,
          "price": 0.17
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.41
        },
        {
          "qty": 25,
          "price": 1.41
        },
        {
          "qty": 50,
          "price": 1.41
        },
        {
          "qty": 100,
          "price": 0.92
        },
        {
          "qty": 200,
          "price": 0.65
        },
        {
          "qty": 300,
          "price": 0.55
        },
        {
          "qty": 500,
          "price": 0.45
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.24
        },
        {
          "qty": 4000,
          "price": 0.24
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 8000,
          "price": 0.18
        },
        {
          "qty": 10000,
          "price": 0.2
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.55
        },
        {
          "qty": 25,
          "price": 1.55
        },
        {
          "qty": 50,
          "price": 1.55
        },
        {
          "qty": 100,
          "price": 1.01
        },
        {
          "qty": 200,
          "price": 0.71
        },
        {
          "qty": 300,
          "price": 0.61
        },
        {
          "qty": 500,
          "price": 0.49
        },
        {
          "qty": 1000,
          "price": 0.4
        },
        {
          "qty": 2000,
          "price": 0.3
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 6000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.56
        },
        {
          "qty": 25,
          "price": 1.56
        },
        {
          "qty": 50,
          "price": 1.56
        },
        {
          "qty": 100,
          "price": 1.06
        },
        {
          "qty": 200,
          "price": 0.75
        },
        {
          "qty": 300,
          "price": 0.64
        },
        {
          "qty": 500,
          "price": 0.52
        },
        {
          "qty": 1000,
          "price": 0.42
        },
        {
          "qty": 2000,
          "price": 0.32
        },
        {
          "qty": 3000,
          "price": 0.28
        },
        {
          "qty": 4000,
          "price": 0.28
        },
        {
          "qty": 5000,
          "price": 0.25
        },
        {
          "qty": 6000,
          "price": 0.24
        },
        {
          "qty": 10000,
          "price": 0.23
        },
        {
          "qty": 11000,
          "price": 0.21
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.86
        },
        {
          "qty": 25,
          "price": 1.86
        },
        {
          "qty": 50,
          "price": 1.86
        },
        {
          "qty": 100,
          "price": 1.3
        },
        {
          "qty": 200,
          "price": 0.99
        },
        {
          "qty": 300,
          "price": 0.86
        },
        {
          "qty": 500,
          "price": 0.73
        },
        {
          "qty": 1000,
          "price": 0.61
        },
        {
          "qty": 2000,
          "price": 0.5
        },
        {
          "qty": 3000,
          "price": 0.43
        },
        {
          "qty": 4000,
          "price": 0.43
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.34
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.96
        },
        {
          "qty": 25,
          "price": 1.96
        },
        {
          "qty": 50,
          "price": 1.96
        },
        {
          "qty": 100,
          "price": 1.37
        },
        {
          "qty": 200,
          "price": 1.04
        },
        {
          "qty": 300,
          "price": 0.9
        },
        {
          "qty": 500,
          "price": 0.76
        },
        {
          "qty": 1000,
          "price": 0.65
        },
        {
          "qty": 2000,
          "price": 0.53
        },
        {
          "qty": 3000,
          "price": 0.45
        },
        {
          "qty": 4000,
          "price": 0.45
        },
        {
          "qty": 5000,
          "price": 0.41
        },
        {
          "qty": 6000,
          "price": 0.39
        },
        {
          "qty": 8000,
          "price": 0.35
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.2
        },
        {
          "qty": 25,
          "price": 2.2
        },
        {
          "qty": 50,
          "price": 2.2
        },
        {
          "qty": 100,
          "price": 1.65
        },
        {
          "qty": 200,
          "price": 1.32
        },
        {
          "qty": 300,
          "price": 1.16
        },
        {
          "qty": 500,
          "price": 1.03
        },
        {
          "qty": 1000,
          "price": 0.88
        },
        {
          "qty": 2000,
          "price": 0.72
        },
        {
          "qty": 3000,
          "price": 0.68
        },
        {
          "qty": 4000,
          "price": 0.68
        },
        {
          "qty": 5000,
          "price": 0.62
        },
        {
          "qty": 10000,
          "price": 0.58
        },
        {
          "qty": 11000,
          "price": 0.57
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.31
        },
        {
          "qty": 25,
          "price": 2.31
        },
        {
          "qty": 50,
          "price": 2.31
        },
        {
          "qty": 100,
          "price": 1.73
        },
        {
          "qty": 200,
          "price": 1.38
        },
        {
          "qty": 300,
          "price": 1.22
        },
        {
          "qty": 500,
          "price": 1.08
        },
        {
          "qty": 1000,
          "price": 0.92
        },
        {
          "qty": 2000,
          "price": 0.76
        },
        {
          "qty": 3000,
          "price": 0.71
        },
        {
          "qty": 4000,
          "price": 0.71
        },
        {
          "qty": 5000,
          "price": 0.65
        },
        {
          "qty": 6000,
          "price": 0.61
        },
        {
          "qty": 8000,
          "price": 0.6
        }
      ]
    }
  },
  "clear": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.35
        },
        {
          "qty": 25,
          "price": 1.35
        },
        {
          "qty": 50,
          "price": 1.35
        },
        {
          "qty": 100,
          "price": 0.87
        },
        {
          "qty": 200,
          "price": 0.62
        },
        {
          "qty": 300,
          "price": 0.52
        },
        {
          "qty": 500,
          "price": 0.43
        },
        {
          "qty": 1000,
          "price": 0.35
        },
        {
          "qty": 2000,
          "price": 0.26
        },
        {
          "qty": 3000,
          "price": 0.23
        },
        {
          "qty": 4000,
          "price": 0.23
        },
        {
          "qty": 5000,
          "price": 0.21
        },
        {
          "qty": 6000,
          "price": 0.2
        },
        {
          "qty": 8000,
          "price": 0.2
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 11000,
          "price": 0.17
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.41
        },
        {
          "qty": 25,
          "price": 1.41
        },
        {
          "qty": 50,
          "price": 1.41
        },
        {
          "qty": 100,
          "price": 0.92
        },
        {
          "qty": 200,
          "price": 0.65
        },
        {
          "qty": 300,
          "price": 0.55
        },
        {
          "qty": 500,
          "price": 0.45
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.24
        },
        {
          "qty": 4000,
          "price": 0.24
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 6000,
          "price": 0.21
        },
        {
          "qty": 8000,
          "price": 0.21
        },
        {
          "qty": 10000,
          "price": 0.2
        },
        {
          "qty": 11000,
          "price": 0.18
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.55
        },
        {
          "qty": 25,
          "price": 1.55
        },
        {
          "qty": 50,
          "price": 1.55
        },
        {
          "qty": 100,
          "price": 1.01
        },
        {
          "qty": 200,
          "price": 0.71
        },
        {
          "qty": 300,
          "price": 0.61
        },
        {
          "qty": 500,
          "price": 0.5
        },
        {
          "qty": 1000,
          "price": 0.4
        },
        {
          "qty": 2000,
          "price": 0.3
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 6000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.63
        },
        {
          "qty": 25,
          "price": 1.63
        },
        {
          "qty": 50,
          "price": 1.63
        },
        {
          "qty": 100,
          "price": 1.06
        },
        {
          "qty": 200,
          "price": 0.75
        },
        {
          "qty": 300,
          "price": 0.64
        },
        {
          "qty": 500,
          "price": 0.52
        },
        {
          "qty": 1000,
          "price": 0.42
        },
        {
          "qty": 2000,
          "price": 0.32
        },
        {
          "qty": 3000,
          "price": 0.28
        },
        {
          "qty": 4000,
          "price": 0.28
        },
        {
          "qty": 5000,
          "price": 0.25
        },
        {
          "qty": 6000,
          "price": 0.24
        },
        {
          "qty": 10000,
          "price": 0.23
        },
        {
          "qty": 11000,
          "price": 0.21
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.86
        },
        {
          "qty": 25,
          "price": 1.86
        },
        {
          "qty": 50,
          "price": 1.86
        },
        {
          "qty": 100,
          "price": 1.3
        },
        {
          "qty": 200,
          "price": 0.99
        },
        {
          "qty": 300,
          "price": 0.86
        },
        {
          "qty": 500,
          "price": 0.73
        },
        {
          "qty": 1000,
          "price": 0.61
        },
        {
          "qty": 2000,
          "price": 0.5
        },
        {
          "qty": 3000,
          "price": 0.43
        },
        {
          "qty": 4000,
          "price": 0.43
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.34
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.96
        },
        {
          "qty": 25,
          "price": 1.96
        },
        {
          "qty": 50,
          "price": 1.96
        },
        {
          "qty": 100,
          "price": 1.37
        },
        {
          "qty": 200,
          "price": 1.04
        },
        {
          "qty": 300,
          "price": 0.9
        },
        {
          "qty": 500,
          "price": 0.76
        },
        {
          "qty": 1000,
          "price": 0.65
        },
        {
          "qty": 2000,
          "price": 0.53
        },
        {
          "qty": 3000,
          "price": 0.45
        },
        {
          "qty": 4000,
          "price": 0.45
        },
        {
          "qty": 5000,
          "price": 0.41
        },
        {
          "qty": 6000,
          "price": 0.39
        },
        {
          "qty": 8000,
          "price": 0.35
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.2
        },
        {
          "qty": 25,
          "price": 2.2
        },
        {
          "qty": 50,
          "price": 2.2
        },
        {
          "qty": 100,
          "price": 1.65
        },
        {
          "qty": 200,
          "price": 1.32
        },
        {
          "qty": 300,
          "price": 1.16
        },
        {
          "qty": 500,
          "price": 1.03
        },
        {
          "qty": 1000,
          "price": 0.88
        },
        {
          "qty": 2000,
          "price": 0.72
        },
        {
          "qty": 3000,
          "price": 0.68
        },
        {
          "qty": 4000,
          "price": 0.68
        },
        {
          "qty": 5000,
          "price": 0.62
        },
        {
          "qty": 10000,
          "price": 0.58
        },
        {
          "qty": 11000,
          "price": 0.57
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.31
        },
        {
          "qty": 25,
          "price": 2.31
        },
        {
          "qty": 50,
          "price": 2.31
        },
        {
          "qty": 100,
          "price": 1.73
        },
        {
          "qty": 200,
          "price": 1.38
        },
        {
          "qty": 300,
          "price": 1.22
        },
        {
          "qty": 500,
          "price": 1.08
        },
        {
          "qty": 1000,
          "price": 0.92
        },
        {
          "qty": 2000,
          "price": 0.76
        },
        {
          "qty": 3000,
          "price": 0.71
        },
        {
          "qty": 4000,
          "price": 0.71
        },
        {
          "qty": 5000,
          "price": 0.65
        },
        {
          "qty": 6000,
          "price": 0.61
        },
        {
          "qty": 8000,
          "price": 0.6
        }
      ]
    }
  },
  "qr-vinyl": {
    "2x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.9
        },
        {
          "qty": 25,
          "price": 1.65
        },
        {
          "qty": 50,
          "price": 1.34
        },
        {
          "qty": 100,
          "price": 0.87
        },
        {
          "qty": 200,
          "price": 0.61
        },
        {
          "qty": 300,
          "price": 0.51
        },
        {
          "qty": 500,
          "price": 0.42
        },
        {
          "qty": 1000,
          "price": 0.34
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.25
        },
        {
          "qty": 4000,
          "price": 0.23
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 6000,
          "price": 0.21
        },
        {
          "qty": 8000,
          "price": 0.2
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 12000,
          "price": 0.18
        },
        {
          "qty": 16000,
          "price": 0.17
        }
      ]
    },
    "2.5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.2
        },
        {
          "qty": 25,
          "price": 1.75
        },
        {
          "qty": 50,
          "price": 1.54
        },
        {
          "qty": 100,
          "price": 1.04
        },
        {
          "qty": 200,
          "price": 0.76
        },
        {
          "qty": 300,
          "price": 0.65
        },
        {
          "qty": 500,
          "price": 0.55
        },
        {
          "qty": 1000,
          "price": 0.45
        },
        {
          "qty": 2000,
          "price": 0.38
        },
        {
          "qty": 3000,
          "price": 0.34
        },
        {
          "qty": 4000,
          "price": 0.32
        },
        {
          "qty": 5000,
          "price": 0.31
        },
        {
          "qty": 6000,
          "price": 0.3
        },
        {
          "qty": 7000,
          "price": 0.29
        },
        {
          "qty": 8000,
          "price": 0.28
        },
        {
          "qty": 9000,
          "price": 0.27
        },
        {
          "qty": 11000,
          "price": 0.26
        },
        {
          "qty": 14000,
          "price": 0.25
        }
      ]
    },
    "3x6": {
      "contour": [
        {
          "qty": 15,
          "price": 2.5
        },
        {
          "qty": 25,
          "price": 2.1
        },
        {
          "qty": 50,
          "price": 1.76
        },
        {
          "qty": 100,
          "price": 1.23
        },
        {
          "qty": 200,
          "price": 0.93
        },
        {
          "qty": 300,
          "price": 0.81
        },
        {
          "qty": 500,
          "price": 0.69
        },
        {
          "qty": 1000,
          "price": 0.58
        },
        {
          "qty": 2000,
          "price": 0.49
        },
        {
          "qty": 3000,
          "price": 0.45
        },
        {
          "qty": 4000,
          "price": 0.42
        },
        {
          "qty": 5000,
          "price": 0.4
        },
        {
          "qty": 6000,
          "price": 0.39
        },
        {
          "qty": 7000,
          "price": 0.38
        },
        {
          "qty": 8000,
          "price": 0.37
        },
        {
          "qty": 9000,
          "price": 0.36
        },
        {
          "qty": 20000,
          "price": 0.35
        }
      ]
    },
    "4x8": {
      "contour": [
        {
          "qty": 15,
          "price": 3.2
        },
        {
          "qty": 25,
          "price": 2.75
        },
        {
          "qty": 50,
          "price": 2.26
        },
        {
          "qty": 100,
          "price": 1.68
        },
        {
          "qty": 200,
          "price": 1.33
        },
        {
          "qty": 300,
          "price": 1.18
        },
        {
          "qty": 500,
          "price": 1.03
        },
        {
          "qty": 1000,
          "price": 0.87
        },
        {
          "qty": 2000,
          "price": 0.49
        },
        {
          "qty": 3000,
          "price": 0.69
        },
        {
          "qty": 4000,
          "price": 0.65
        },
        {
          "qty": 5000,
          "price": 0.63
        },
        {
          "qty": 6000,
          "price": 0.63
        },
        {
          "qty": 8000,
          "price": 0.62
        }
      ]
    }
  },
  "qr-holographic": {
    "2x4": {
      "contour": [
        {
          "qty": 15,
          "price": 2.4
        },
        {
          "qty": 25,
          "price": 2.05
        },
        {
          "qty": 50,
          "price": 1.68
        },
        {
          "qty": 100,
          "price": 1.08
        },
        {
          "qty": 200,
          "price": 0.76
        },
        {
          "qty": 300,
          "price": 0.64
        },
        {
          "qty": 500,
          "price": 0.52
        },
        {
          "qty": 1000,
          "price": 0.42
        },
        {
          "qty": 2000,
          "price": 0.35
        },
        {
          "qty": 3000,
          "price": 0.31
        },
        {
          "qty": 4000,
          "price": 0.32
        },
        {
          "qty": 5000,
          "price": 0.3
        },
        {
          "qty": 6000,
          "price": 0.29
        },
        {
          "qty": 7000,
          "price": 0.28
        },
        {
          "qty": 8000,
          "price": 0.27
        },
        {
          "qty": 10000,
          "price": 0.26
        },
        {
          "qty": 11000,
          "price": 0.25
        },
        {
          "qty": 14000,
          "price": 0.24
        },
        {
          "qty": 17000,
          "price": 0.23
        },
        {
          "qty": 24000,
          "price": 0.22
        }
      ]
    },
    "2.5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.7
        },
        {
          "qty": 25,
          "price": 2.35
        },
        {
          "qty": 50,
          "price": 1.92
        },
        {
          "qty": 100,
          "price": 1.3
        },
        {
          "qty": 200,
          "price": 0.95
        },
        {
          "qty": 300,
          "price": 0.81
        },
        {
          "qty": 500,
          "price": 0.68
        },
        {
          "qty": 1000,
          "price": 0.56
        },
        {
          "qty": 2000,
          "price": 0.47
        },
        {
          "qty": 3000,
          "price": 0.43
        },
        {
          "qty": 4000,
          "price": 0.44
        },
        {
          "qty": 5000,
          "price": 0.41
        },
        {
          "qty": 6000,
          "price": 0.4
        },
        {
          "qty": 7000,
          "price": 0.39
        },
        {
          "qty": 8000,
          "price": 0.38
        },
        {
          "qty": 9000,
          "price": 0.37
        },
        {
          "qty": 10000,
          "price": 0.36
        },
        {
          "qty": 11000,
          "price": 0.35
        },
        {
          "qty": 13000,
          "price": 0.34
        },
        {
          "qty": 37000,
          "price": 0.33
        }
      ]
    },
    "3x6": {
      "contour": [
        {
          "qty": 15,
          "price": 3.1
        },
        {
          "qty": 25,
          "price": 2.65
        },
        {
          "qty": 50,
          "price": 2.18
        },
        {
          "qty": 100,
          "price": 1.54
        },
        {
          "qty": 200,
          "price": 1.16
        },
        {
          "qty": 300,
          "price": 1.01
        },
        {
          "qty": 500,
          "price": 0.86
        },
        {
          "qty": 1000,
          "price": 0.72
        },
        {
          "qty": 2000,
          "price": 0.61
        },
        {
          "qty": 3000,
          "price": 0.56
        },
        {
          "qty": 4000,
          "price": 0.57
        },
        {
          "qty": 5000,
          "price": 0.54
        },
        {
          "qty": 6000,
          "price": 0.52
        },
        {
          "qty": 7000,
          "price": 0.51
        },
        {
          "qty": 8000,
          "price": 0.49
        },
        {
          "qty": 12000,
          "price": 0.48
        },
        {
          "qty": 31000,
          "price": 0.47
        }
      ]
    },
    "4x8": {
      "contour": [
        {
          "qty": 15,
          "price": 3.9
        },
        {
          "qty": 25,
          "price": 3.4
        },
        {
          "qty": 50,
          "price": 2.82
        },
        {
          "qty": 100,
          "price": 2.1
        },
        {
          "qty": 200,
          "price": 1.66
        },
        {
          "qty": 300,
          "price": 1.47
        },
        {
          "qty": 500,
          "price": 1.29
        },
        {
          "qty": 1000,
          "price": 1.09
        },
        {
          "qty": 2000,
          "price": 0.94
        },
        {
          "qty": 3000,
          "price": 0.87
        },
        {
          "qty": 4000,
          "price": 0.88
        },
        {
          "qty": 5000,
          "price": 0.85
        },
        {
          "qty": 8000,
          "price": 0.84
        },
        {
          "qty": 16000,
          "price": 0.83
        }
      ]
    }
  },
  "sheets": {
    "4x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.33
        },
        {
          "qty": 25,
          "price": 1.33
        },
        {
          "qty": 50,
          "price": 1.33
        },
        {
          "qty": 100,
          "price": 0.86
        },
        {
          "qty": 200,
          "price": 0.61
        },
        {
          "qty": 300,
          "price": 0.52
        },
        {
          "qty": 500,
          "price": 0.43
        },
        {
          "qty": 1000,
          "price": 0.35
        },
        {
          "qty": 2000,
          "price": 0.26
        },
        {
          "qty": 3000,
          "price": 0.23
        },
        {
          "qty": 4000,
          "price": 0.23
        },
        {
          "qty": 5000,
          "price": 0.2
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 11000,
          "price": 0.17
        }
      ]
    },
    "6x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.87
        },
        {
          "qty": 25,
          "price": 1.87
        },
        {
          "qty": 50,
          "price": 1.87
        },
        {
          "qty": 100,
          "price": 1.4
        },
        {
          "qty": 200,
          "price": 1.12
        },
        {
          "qty": 300,
          "price": 0.99
        },
        {
          "qty": 500,
          "price": 0.88
        },
        {
          "qty": 1000,
          "price": 0.75
        },
        {
          "qty": 2000,
          "price": 0.62
        },
        {
          "qty": 3000,
          "price": 0.58
        },
        {
          "qty": 4000,
          "price": 0.52
        },
        {
          "qty": 5000,
          "price": 0.52
        },
        {
          "qty": 10000,
          "price": 0.5
        },
        {
          "qty": 11000,
          "price": 0.49
        }
      ]
    },
    "7x5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.22
        },
        {
          "qty": 25,
          "price": 2.22
        },
        {
          "qty": 50,
          "price": 2.22
        },
        {
          "qty": 100,
          "price": 1.67
        },
        {
          "qty": 200,
          "price": 1.33
        },
        {
          "qty": 300,
          "price": 1.18
        },
        {
          "qty": 500,
          "price": 1.04
        },
        {
          "qty": 1000,
          "price": 0.89
        },
        {
          "qty": 2000,
          "price": 0.73
        },
        {
          "qty": 3000,
          "price": 0.58
        },
        {
          "qty": 4000,
          "price": 0.69
        },
        {
          "qty": 5000,
          "price": 0.62
        },
        {
          "qty": 10000,
          "price": 0.59
        },
        {
          "qty": 11000,
          "price": 0.58
        }
      ]
    },
    "11x8.5": {
      "contour": [
        {
          "qty": 15,
          "price": 3.78
        },
        {
          "qty": 25,
          "price": 3.78
        },
        {
          "qty": 50,
          "price": 3.78
        },
        {
          "qty": 100,
          "price": 3.1
        },
        {
          "qty": 200,
          "price": 2.65
        },
        {
          "qty": 300,
          "price": 2.42
        },
        {
          "qty": 500,
          "price": 2.15
        },
        {
          "qty": 1000,
          "price": 1.89
        },
        {
          "qty": 2000,
          "price": 1.81
        },
        {
          "qty": 3000,
          "price": 1.78
        },
        {
          "qty": 4000,
          "price": 0.69
        },
        {
          "qty": 5000,
          "price": 1.74
        },
        {
          "qty": 10000,
          "price": 1.7
        }
      ]
    }
  },
  "easy-peel": {
    "2x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.22
        },
        {
          "qty": 25,
          "price": 1.22
        },
        {
          "qty": 50,
          "price": 1.22
        },
        {
          "qty": 100,
          "price": 0.81
        },
        {
          "qty": 200,
          "price": 0.59
        },
        {
          "qty": 300,
          "price": 0.51
        },
        {
          "qty": 500,
          "price": 0.42
        },
        {
          "qty": 1000,
          "price": 0.35
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.25
        },
        {
          "qty": 4000,
          "price": 0.25
        },
        {
          "qty": 5000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.17
        },
        {
          "qty": 11000,
          "price": 0.16
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.27
        },
        {
          "qty": 25,
          "price": 1.27
        },
        {
          "qty": 50,
          "price": 1.27
        },
        {
          "qty": 100,
          "price": 0.62
        },
        {
          "qty": 200,
          "price": 0.6
        },
        {
          "qty": 300,
          "price": 0.5
        },
        {
          "qty": 500,
          "price": 0.42
        },
        {
          "qty": 1000,
          "price": 0.34
        },
        {
          "qty": 2000,
          "price": 0.34
        },
        {
          "qty": 3000,
          "price": 0.27
        },
        {
          "qty": 4000,
          "price": 0.27
        },
        {
          "qty": 5000,
          "price": 0.26
        },
        {
          "qty": 10000,
          "price": 0.18
        },
        {
          "qty": 11000,
          "price": 0.21
        }
      ]
    },
    "3x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.4
        },
        {
          "qty": 25,
          "price": 1.4
        },
        {
          "qty": 50,
          "price": 1.4
        },
        {
          "qty": 100,
          "price": 0.93
        },
        {
          "qty": 200,
          "price": 0.67
        },
        {
          "qty": 300,
          "price": 0.58
        },
        {
          "qty": 500,
          "price": 0.48
        },
        {
          "qty": 1000,
          "price": 0.4
        },
        {
          "qty": 2000,
          "price": 0.31
        },
        {
          "qty": 3000,
          "price": 0.28
        },
        {
          "qty": 4000,
          "price": 0.28
        },
        {
          "qty": 5000,
          "price": 0.26
        },
        {
          "qty": 6000,
          "price": 0.25
        },
        {
          "qty": 10000,
          "price": 0.24
        },
        {
          "qty": 11000,
          "price": 0.23
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.42
        },
        {
          "qty": 25,
          "price": 1.42
        },
        {
          "qty": 50,
          "price": 1.42
        },
        {
          "qty": 100,
          "price": 0.95
        },
        {
          "qty": 200,
          "price": 0.7
        },
        {
          "qty": 300,
          "price": 0.63
        },
        {
          "qty": 500,
          "price": 0.55
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.39
        },
        {
          "qty": 3000,
          "price": 0.35
        },
        {
          "qty": 4000,
          "price": 0.35
        },
        {
          "qty": 5000,
          "price": 0.31
        },
        {
          "qty": 6000,
          "price": 0.29
        },
        {
          "qty": 10000,
          "price": 0.25
        },
        {
          "qty": 11000,
          "price": 0.24
        }
      ]
    },
    "4x4": {
      "contour": [
        {
          "qty": 15,
          "price": 1.67
        },
        {
          "qty": 25,
          "price": 1.67
        },
        {
          "qty": 50,
          "price": 1.67
        },
        {
          "qty": 100,
          "price": 1.18
        },
        {
          "qty": 200,
          "price": 0.91
        },
        {
          "qty": 300,
          "price": 0.8
        },
        {
          "qty": 500,
          "price": 0.68
        },
        {
          "qty": 1000,
          "price": 0.58
        },
        {
          "qty": 2000,
          "price": 0.49
        },
        {
          "qty": 3000,
          "price": 0.42
        },
        {
          "qty": 4000,
          "price": 0.42
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.34
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.7
        },
        {
          "qty": 25,
          "price": 1.7
        },
        {
          "qty": 50,
          "price": 1.7
        },
        {
          "qty": 100,
          "price": 1.25
        },
        {
          "qty": 200,
          "price": 0.93
        },
        {
          "qty": 300,
          "price": 0.82
        },
        {
          "qty": 500,
          "price": 0.71
        },
        {
          "qty": 1000,
          "price": 0.64
        },
        {
          "qty": 2000,
          "price": 0.53
        },
        {
          "qty": 3000,
          "price": 0.44
        },
        {
          "qty": 4000,
          "price": 0.44
        },
        {
          "qty": 5000,
          "price": 0.43
        },
        {
          "qty": 6000,
          "price": 0.38
        },
        {
          "qty": 8000,
          "price": 0.35
        }
      ]
    },
    "5x5": {
      "contour": [
        {
          "qty": 15,
          "price": 1.96
        },
        {
          "qty": 25,
          "price": 1.96
        },
        {
          "qty": 50,
          "price": 1.96
        },
        {
          "qty": 100,
          "price": 1.48
        },
        {
          "qty": 200,
          "price": 1.2
        },
        {
          "qty": 300,
          "price": 1.06
        },
        {
          "qty": 500,
          "price": 0.95
        },
        {
          "qty": 1000,
          "price": 0.81
        },
        {
          "qty": 2000,
          "price": 0.68
        },
        {
          "qty": 3000,
          "price": 0.64
        },
        {
          "qty": 4000,
          "price": 0.64
        },
        {
          "qty": 5000,
          "price": 0.58
        },
        {
          "qty": 10000,
          "price": 0.56
        },
        {
          "qty": 11000,
          "price": 0.55
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.01
        },
        {
          "qty": 25,
          "price": 2.01
        },
        {
          "qty": 50,
          "price": 2.01
        },
        {
          "qty": 100,
          "price": 1.67
        },
        {
          "qty": 200,
          "price": 1.38
        },
        {
          "qty": 300,
          "price": 1.13
        },
        {
          "qty": 500,
          "price": 0.99
        },
        {
          "qty": 1000,
          "price": 0.86
        },
        {
          "qty": 2000,
          "price": 0.73
        },
        {
          "qty": 3000,
          "price": 0.66
        },
        {
          "qty": 4000,
          "price": 0.66
        },
        {
          "qty": 5000,
          "price": 0.64
        },
        {
          "qty": 10000,
          "price": 0.57
        },
        {
          "qty": 11000,
          "price": 0.56
        }
      ]
    }
  },
  "static-cling": {
    "2x2": {
      "contour": [
        { "qty": 15, "price": 1.09 },
        { "qty": 25, "price": 1.09 },
        { "qty": 50, "price": 1.09 },
        { "qty": 100, "price": 0.71 },
        { "qty": 200, "price": 0.50 },
        { "qty": 300, "price": 0.43 },
        { "qty": 500, "price": 0.35 },
        { "qty": 1000, "price": 0.28 },
        { "qty": 2000, "price": 0.21 },
        { "qty": 3000, "price": 0.19 },
        { "qty": 4000, "price": 0.19 },
        { "qty": 5000, "price": 0.17 },
        { "qty": 10000, "price": 0.16 },
        { "qty": 11000, "price": 0.14 }
      ]
    },
    "3x3": {
      "contour": [
        { "qty": 15, "price": 1.26 },
        { "qty": 25, "price": 1.26 },
        { "qty": 50, "price": 1.26 },
        { "qty": 100, "price": 0.82 },
        { "qty": 200, "price": 0.58 },
        { "qty": 300, "price": 0.49 },
        { "qty": 500, "price": 0.40 },
        { "qty": 1000, "price": 0.33 },
        { "qty": 2000, "price": 0.25 },
        { "qty": 3000, "price": 0.21 },
        { "qty": 4000, "price": 0.21 },
        { "qty": 5000, "price": 0.19 },
        { "qty": 6000, "price": 0.18 },
        { "qty": 10000, "price": 0.18 },
        { "qty": 11000, "price": 0.16 }
      ]
    },
    "4x4": {
      "contour": [
        { "qty": 15, "price": 1.51 },
        { "qty": 25, "price": 1.51 },
        { "qty": 50, "price": 1.51 },
        { "qty": 100, "price": 1.06 },
        { "qty": 200, "price": 0.80 },
        { "qty": 300, "price": 0.70 },
        { "qty": 500, "price": 0.59 },
        { "qty": 1000, "price": 0.50 },
        { "qty": 2000, "price": 0.41 },
        { "qty": 3000, "price": 0.35 },
        { "qty": 4000, "price": 0.35 },
        { "qty": 5000, "price": 0.32 },
        { "qty": 10000, "price": 0.30 },
        { "qty": 11000, "price": 0.27 }
      ]
    },
    "5x5": {
      "contour": [
        { "qty": 15, "price": 1.79 },
        { "qty": 25, "price": 1.79 },
        { "qty": 50, "price": 1.79 },
        { "qty": 100, "price": 1.34 },
        { "qty": 200, "price": 1.07 },
        { "qty": 300, "price": 0.95 },
        { "qty": 500, "price": 0.84 },
        { "qty": 1000, "price": 0.71 },
        { "qty": 2000, "price": 0.59 },
        { "qty": 3000, "price": 0.55 },
        { "qty": 4000, "price": 0.55 },
        { "qty": 5000, "price": 0.50 },
        { "qty": 10000, "price": 0.48 },
        { "qty": 11000, "price": 0.46 }
      ]
    }
  }
};

export const POPULAR_PRICING: Record<string, SizeTables> = {
  "premium-vinyl": {
    "3x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.25
        },
        {
          "qty": 25,
          "price": 1.25
        },
        {
          "qty": 50,
          "price": 1.25
        },
        {
          "qty": 100,
          "price": 0.81
        },
        {
          "qty": 200,
          "price": 0.57
        },
        {
          "qty": 300,
          "price": 0.49
        },
        {
          "qty": 500,
          "price": 0.4
        },
        {
          "qty": 1000,
          "price": 0.33
        },
        {
          "qty": 2000,
          "price": 0.24
        },
        {
          "qty": 3000,
          "price": 0.21
        },
        {
          "qty": 4000,
          "price": 0.21
        },
        {
          "qty": 5000,
          "price": 0.19
        },
        {
          "qty": 10000,
          "price": 0.18
        },
        {
          "qty": 11000,
          "price": 0.16
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.31
        },
        {
          "qty": 25,
          "price": 1.31
        },
        {
          "qty": 50,
          "price": 1.31
        },
        {
          "qty": 100,
          "price": 0.85
        },
        {
          "qty": 200,
          "price": 0.6
        },
        {
          "qty": 300,
          "price": 0.51
        },
        {
          "qty": 500,
          "price": 0.42
        },
        {
          "qty": 1000,
          "price": 0.34
        },
        {
          "qty": 2000,
          "price": 0.26
        },
        {
          "qty": 3000,
          "price": 0.22
        },
        {
          "qty": 4000,
          "price": 0.22
        },
        {
          "qty": 5000,
          "price": 0.2
        },
        {
          "qty": 10000,
          "price": 0.19
        },
        {
          "qty": 11000,
          "price": 0.17
        }
      ]
    },
    "4x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.48
        },
        {
          "qty": 25,
          "price": 1.48
        },
        {
          "qty": 50,
          "price": 1.48
        },
        {
          "qty": 100,
          "price": 1.04
        },
        {
          "qty": 200,
          "price": 0.78
        },
        {
          "qty": 300,
          "price": 0.68
        },
        {
          "qty": 500,
          "price": 0.58
        },
        {
          "qty": 1000,
          "price": 0.49
        },
        {
          "qty": 2000,
          "price": 0.4
        },
        {
          "qty": 3000,
          "price": 0.34
        },
        {
          "qty": 4000,
          "price": 0.34
        },
        {
          "qty": 5000,
          "price": 0.31
        },
        {
          "qty": 10000,
          "price": 0.3
        },
        {
          "qty": 11000,
          "price": 0.27
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.55
        },
        {
          "qty": 25,
          "price": 1.55
        },
        {
          "qty": 50,
          "price": 1.55
        },
        {
          "qty": 100,
          "price": 1.09
        },
        {
          "qty": 200,
          "price": 0.82
        },
        {
          "qty": 300,
          "price": 0.71
        },
        {
          "qty": 500,
          "price": 0.61
        },
        {
          "qty": 1000,
          "price": 0.51
        },
        {
          "qty": 2000,
          "price": 0.42
        },
        {
          "qty": 3000,
          "price": 0.36
        },
        {
          "qty": 4000,
          "price": 0.36
        },
        {
          "qty": 5000,
          "price": 0.33
        },
        {
          "qty": 10000,
          "price": 0.31
        },
        {
          "qty": 11000,
          "price": 0.28
        }
      ]
    },
    "5.5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.07
        },
        {
          "qty": 25,
          "price": 2.07
        },
        {
          "qty": 50,
          "price": 2.07
        },
        {
          "qty": 100,
          "price": 1.56
        },
        {
          "qty": 200,
          "price": 1.24
        },
        {
          "qty": 300,
          "price": 1.1
        },
        {
          "qty": 500,
          "price": 0.98
        },
        {
          "qty": 1000,
          "price": 0.83
        },
        {
          "qty": 2000,
          "price": 0.68
        },
        {
          "qty": 3000,
          "price": 0.64
        },
        {
          "qty": 4000,
          "price": 0.64
        },
        {
          "qty": 5000,
          "price": 0.58
        },
        {
          "qty": 10000,
          "price": 0.55
        },
        {
          "qty": 11000,
          "price": 0.54
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.18
        },
        {
          "qty": 25,
          "price": 2.18
        },
        {
          "qty": 50,
          "price": 2.18
        },
        {
          "qty": 100,
          "price": 1.63
        },
        {
          "qty": 200,
          "price": 1.31
        },
        {
          "qty": 300,
          "price": 1.15
        },
        {
          "qty": 500,
          "price": 1.02
        },
        {
          "qty": 1000,
          "price": 0.87
        },
        {
          "qty": 2000,
          "price": 0.72
        },
        {
          "qty": 3000,
          "price": 0.68
        },
        {
          "qty": 4000,
          "price": 0.68
        },
        {
          "qty": 5000,
          "price": 0.61
        },
        {
          "qty": 10000,
          "price": 0.58
        },
        {
          "qty": 11000,
          "price": 0.57
        }
      ]
    },
    "11x3": {
      "contour": [
        {
          "qty": 15,
          "price": 2.15
        },
        {
          "qty": 25,
          "price": 2.15
        },
        {
          "qty": 50,
          "price": 2.15
        },
        {
          "qty": 100,
          "price": 1.61
        },
        {
          "qty": 200,
          "price": 1.29
        },
        {
          "qty": 300,
          "price": 1.14
        },
        {
          "qty": 500,
          "price": 1.01
        },
        {
          "qty": 1000,
          "price": 0.86
        },
        {
          "qty": 2000,
          "price": 0.71
        },
        {
          "qty": 3000,
          "price": 0.67
        },
        {
          "qty": 4000,
          "price": 0.67
        },
        {
          "qty": 5000,
          "price": 0.6
        },
        {
          "qty": 10000,
          "price": 0.57
        },
        {
          "qty": 11000,
          "price": 0.56
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.26
        },
        {
          "qty": 25,
          "price": 2.26
        },
        {
          "qty": 50,
          "price": 2.26
        },
        {
          "qty": 100,
          "price": 1.69
        },
        {
          "qty": 200,
          "price": 1.35
        },
        {
          "qty": 300,
          "price": 1.2
        },
        {
          "qty": 500,
          "price": 1.06
        },
        {
          "qty": 1000,
          "price": 0.9
        },
        {
          "qty": 2000,
          "price": 0.74
        },
        {
          "qty": 3000,
          "price": 0.7
        },
        {
          "qty": 4000,
          "price": 0.7
        },
        {
          "qty": 5000,
          "price": 0.63
        },
        {
          "qty": 10000,
          "price": 0.6
        },
        {
          "qty": 11000,
          "price": 0.59
        }
      ]
    }
  },
  "holographic": {
    "3x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.58
        },
        {
          "qty": 25,
          "price": 1.58
        },
        {
          "qty": 50,
          "price": 1.58
        },
        {
          "qty": 100,
          "price": 1.03
        },
        {
          "qty": 200,
          "price": 0.73
        },
        {
          "qty": 300,
          "price": 0.62
        },
        {
          "qty": 500,
          "price": 0.51
        },
        {
          "qty": 1000,
          "price": 0.41
        },
        {
          "qty": 2000,
          "price": 0.31
        },
        {
          "qty": 3000,
          "price": 0.27
        },
        {
          "qty": 4000,
          "price": 0.27
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 10000,
          "price": 0.23
        },
        {
          "qty": 11000,
          "price": 0.21
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.66
        },
        {
          "qty": 25,
          "price": 1.66
        },
        {
          "qty": 50,
          "price": 1.66
        },
        {
          "qty": 100,
          "price": 1.08
        },
        {
          "qty": 200,
          "price": 0.76
        },
        {
          "qty": 300,
          "price": 0.65
        },
        {
          "qty": 500,
          "price": 0.53
        },
        {
          "qty": 1000,
          "price": 0.43
        },
        {
          "qty": 2000,
          "price": 0.32
        },
        {
          "qty": 3000,
          "price": 0.28
        },
        {
          "qty": 4000,
          "price": 0.28
        },
        {
          "qty": 5000,
          "price": 0.25
        },
        {
          "qty": 10000,
          "price": 0.24
        },
        {
          "qty": 11000,
          "price": 0.22
        }
      ]
    },
    "4x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.87
        },
        {
          "qty": 25,
          "price": 1.87
        },
        {
          "qty": 50,
          "price": 1.87
        },
        {
          "qty": 100,
          "price": 1.31
        },
        {
          "qty": 200,
          "price": 0.99
        },
        {
          "qty": 300,
          "price": 0.86
        },
        {
          "qty": 500,
          "price": 0.73
        },
        {
          "qty": 1000,
          "price": 0.62
        },
        {
          "qty": 2000,
          "price": 0.51
        },
        {
          "qty": 3000,
          "price": 0.43
        },
        {
          "qty": 4000,
          "price": 0.43
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.34
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.97
        },
        {
          "qty": 25,
          "price": 1.97
        },
        {
          "qty": 50,
          "price": 1.97
        },
        {
          "qty": 100,
          "price": 1.38
        },
        {
          "qty": 200,
          "price": 1.04
        },
        {
          "qty": 300,
          "price": 0.9
        },
        {
          "qty": 500,
          "price": 0.77
        },
        {
          "qty": 1000,
          "price": 0.65
        },
        {
          "qty": 2000,
          "price": 0.53
        },
        {
          "qty": 3000,
          "price": 0.45
        },
        {
          "qty": 4000,
          "price": 0.45
        },
        {
          "qty": 5000,
          "price": 0.41
        },
        {
          "qty": 10000,
          "price": 0.39
        },
        {
          "qty": 11000,
          "price": 0.35
        }
      ]
    },
    "5.5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.62
        },
        {
          "qty": 25,
          "price": 2.62
        },
        {
          "qty": 50,
          "price": 2.62
        },
        {
          "qty": 100,
          "price": 1.97
        },
        {
          "qty": 200,
          "price": 1.57
        },
        {
          "qty": 300,
          "price": 1.39
        },
        {
          "qty": 500,
          "price": 1.23
        },
        {
          "qty": 1000,
          "price": 1.05
        },
        {
          "qty": 2000,
          "price": 0.87
        },
        {
          "qty": 3000,
          "price": 0.81
        },
        {
          "qty": 4000,
          "price": 0.81
        },
        {
          "qty": 5000,
          "price": 0.73
        },
        {
          "qty": 10000,
          "price": 0.7
        },
        {
          "qty": 11000,
          "price": 0.68
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.76
        },
        {
          "qty": 25,
          "price": 2.76
        },
        {
          "qty": 50,
          "price": 2.76
        },
        {
          "qty": 100,
          "price": 2.07
        },
        {
          "qty": 200,
          "price": 1.65
        },
        {
          "qty": 300,
          "price": 1.46
        },
        {
          "qty": 500,
          "price": 1.3
        },
        {
          "qty": 1000,
          "price": 1.1
        },
        {
          "qty": 2000,
          "price": 0.91
        },
        {
          "qty": 3000,
          "price": 0.85
        },
        {
          "qty": 4000,
          "price": 0.85
        },
        {
          "qty": 5000,
          "price": 0.77
        },
        {
          "qty": 10000,
          "price": 0.73
        },
        {
          "qty": 11000,
          "price": 0.72
        }
      ]
    },
    "11x3": {
      "contour": [
        {
          "qty": 15,
          "price": 2.72
        },
        {
          "qty": 25,
          "price": 2.72
        },
        {
          "qty": 50,
          "price": 2.72
        },
        {
          "qty": 100,
          "price": 2.04
        },
        {
          "qty": 200,
          "price": 1.63
        },
        {
          "qty": 300,
          "price": 1.44
        },
        {
          "qty": 500,
          "price": 1.28
        },
        {
          "qty": 1000,
          "price": 1.09
        },
        {
          "qty": 2000,
          "price": 0.9
        },
        {
          "qty": 3000,
          "price": 0.84
        },
        {
          "qty": 4000,
          "price": 0.84
        },
        {
          "qty": 5000,
          "price": 0.76
        },
        {
          "qty": 10000,
          "price": 0.72
        },
        {
          "qty": 11000,
          "price": 0.71
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.86
        },
        {
          "qty": 25,
          "price": 2.86
        },
        {
          "qty": 50,
          "price": 2.86
        },
        {
          "qty": 100,
          "price": 2.14
        },
        {
          "qty": 200,
          "price": 1.71
        },
        {
          "qty": 300,
          "price": 1.51
        },
        {
          "qty": 500,
          "price": 1.34
        },
        {
          "qty": 1000,
          "price": 1.14
        },
        {
          "qty": 2000,
          "price": 0.94
        },
        {
          "qty": 3000,
          "price": 0.89
        },
        {
          "qty": 4000,
          "price": 0.89
        },
        {
          "qty": 5000,
          "price": 0.8
        },
        {
          "qty": 10000,
          "price": 0.76
        },
        {
          "qty": 11000,
          "price": 0.74
        }
      ]
    }
  },
  "chrome": {
    "3x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.58
        },
        {
          "qty": 25,
          "price": 1.58
        },
        {
          "qty": 50,
          "price": 1.58
        },
        {
          "qty": 100,
          "price": 1.03
        },
        {
          "qty": 200,
          "price": 0.73
        },
        {
          "qty": 300,
          "price": 0.62
        },
        {
          "qty": 500,
          "price": 0.51
        },
        {
          "qty": 1000,
          "price": 0.41
        },
        {
          "qty": 2000,
          "price": 0.31
        },
        {
          "qty": 3000,
          "price": 0.27
        },
        {
          "qty": 4000,
          "price": 0.27
        },
        {
          "qty": 5000,
          "price": 0.24
        },
        {
          "qty": 10000,
          "price": 0.23
        },
        {
          "qty": 11000,
          "price": 0.21
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.66
        },
        {
          "qty": 25,
          "price": 1.66
        },
        {
          "qty": 50,
          "price": 1.66
        },
        {
          "qty": 100,
          "price": 1.08
        },
        {
          "qty": 200,
          "price": 0.76
        },
        {
          "qty": 300,
          "price": 0.65
        },
        {
          "qty": 500,
          "price": 0.53
        },
        {
          "qty": 1000,
          "price": 0.43
        },
        {
          "qty": 2000,
          "price": 0.32
        },
        {
          "qty": 3000,
          "price": 0.28
        },
        {
          "qty": 4000,
          "price": 0.28
        },
        {
          "qty": 5000,
          "price": 0.25
        },
        {
          "qty": 10000,
          "price": 0.24
        },
        {
          "qty": 11000,
          "price": 0.22
        }
      ]
    },
    "4x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.87
        },
        {
          "qty": 25,
          "price": 1.87
        },
        {
          "qty": 50,
          "price": 1.87
        },
        {
          "qty": 100,
          "price": 1.31
        },
        {
          "qty": 200,
          "price": 0.99
        },
        {
          "qty": 300,
          "price": 0.86
        },
        {
          "qty": 500,
          "price": 0.73
        },
        {
          "qty": 1000,
          "price": 0.62
        },
        {
          "qty": 2000,
          "price": 0.51
        },
        {
          "qty": 3000,
          "price": 0.43
        },
        {
          "qty": 4000,
          "price": 0.43
        },
        {
          "qty": 5000,
          "price": 0.39
        },
        {
          "qty": 10000,
          "price": 0.37
        },
        {
          "qty": 11000,
          "price": 0.34
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.97
        },
        {
          "qty": 25,
          "price": 1.97
        },
        {
          "qty": 50,
          "price": 1.97
        },
        {
          "qty": 100,
          "price": 1.38
        },
        {
          "qty": 200,
          "price": 1.04
        },
        {
          "qty": 300,
          "price": 0.9
        },
        {
          "qty": 500,
          "price": 0.77
        },
        {
          "qty": 1000,
          "price": 0.65
        },
        {
          "qty": 2000,
          "price": 0.53
        },
        {
          "qty": 3000,
          "price": 0.45
        },
        {
          "qty": 4000,
          "price": 0.45
        },
        {
          "qty": 5000,
          "price": 0.41
        },
        {
          "qty": 10000,
          "price": 0.39
        },
        {
          "qty": 11000,
          "price": 0.35
        }
      ]
    },
    "5.5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.62
        },
        {
          "qty": 25,
          "price": 2.62
        },
        {
          "qty": 50,
          "price": 2.62
        },
        {
          "qty": 100,
          "price": 1.97
        },
        {
          "qty": 200,
          "price": 1.57
        },
        {
          "qty": 300,
          "price": 1.39
        },
        {
          "qty": 500,
          "price": 1.23
        },
        {
          "qty": 1000,
          "price": 1.05
        },
        {
          "qty": 2000,
          "price": 0.87
        },
        {
          "qty": 3000,
          "price": 0.81
        },
        {
          "qty": 4000,
          "price": 0.81
        },
        {
          "qty": 5000,
          "price": 0.73
        },
        {
          "qty": 10000,
          "price": 0.7
        },
        {
          "qty": 11000,
          "price": 0.68
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.76
        },
        {
          "qty": 25,
          "price": 2.76
        },
        {
          "qty": 50,
          "price": 2.76
        },
        {
          "qty": 100,
          "price": 2.07
        },
        {
          "qty": 200,
          "price": 1.65
        },
        {
          "qty": 300,
          "price": 1.46
        },
        {
          "qty": 500,
          "price": 1.3
        },
        {
          "qty": 1000,
          "price": 1.1
        },
        {
          "qty": 2000,
          "price": 0.91
        },
        {
          "qty": 3000,
          "price": 0.85
        },
        {
          "qty": 4000,
          "price": 0.85
        },
        {
          "qty": 5000,
          "price": 0.77
        },
        {
          "qty": 10000,
          "price": 0.73
        },
        {
          "qty": 11000,
          "price": 0.72
        }
      ]
    },
    "11x3": {
      "contour": [
        {
          "qty": 15,
          "price": 2.72
        },
        {
          "qty": 25,
          "price": 2.72
        },
        {
          "qty": 50,
          "price": 2.72
        },
        {
          "qty": 100,
          "price": 2.04
        },
        {
          "qty": 200,
          "price": 1.63
        },
        {
          "qty": 300,
          "price": 1.44
        },
        {
          "qty": 500,
          "price": 1.28
        },
        {
          "qty": 1000,
          "price": 1.09
        },
        {
          "qty": 2000,
          "price": 0.9
        },
        {
          "qty": 3000,
          "price": 0.84
        },
        {
          "qty": 4000,
          "price": 0.84
        },
        {
          "qty": 5000,
          "price": 0.76
        },
        {
          "qty": 10000,
          "price": 0.72
        },
        {
          "qty": 11000,
          "price": 0.71
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.86
        },
        {
          "qty": 25,
          "price": 2.86
        },
        {
          "qty": 50,
          "price": 2.86
        },
        {
          "qty": 100,
          "price": 2.14
        },
        {
          "qty": 200,
          "price": 1.71
        },
        {
          "qty": 300,
          "price": 1.51
        },
        {
          "qty": 500,
          "price": 1.34
        },
        {
          "qty": 1000,
          "price": 1.14
        },
        {
          "qty": 2000,
          "price": 0.94
        },
        {
          "qty": 3000,
          "price": 0.89
        },
        {
          "qty": 4000,
          "price": 0.89
        },
        {
          "qty": 5000,
          "price": 0.8
        },
        {
          "qty": 10000,
          "price": 0.76
        },
        {
          "qty": 11000,
          "price": 0.74
        }
      ]
    }
  },
  "glitter": {
    "3x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.44
        },
        {
          "qty": 25,
          "price": 1.44
        },
        {
          "qty": 50,
          "price": 1.44
        },
        {
          "qty": 100,
          "price": 0.93
        },
        {
          "qty": 200,
          "price": 0.66
        },
        {
          "qty": 300,
          "price": 0.56
        },
        {
          "qty": 500,
          "price": 0.46
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.24
        },
        {
          "qty": 4000,
          "price": 0.24
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 10000,
          "price": 0.2
        },
        {
          "qty": 11000,
          "price": 0.19
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.51
        },
        {
          "qty": 25,
          "price": 1.51
        },
        {
          "qty": 50,
          "price": 1.51
        },
        {
          "qty": 100,
          "price": 0.98
        },
        {
          "qty": 200,
          "price": 0.69
        },
        {
          "qty": 300,
          "price": 0.59
        },
        {
          "qty": 500,
          "price": 0.48
        },
        {
          "qty": 1000,
          "price": 0.39
        },
        {
          "qty": 2000,
          "price": 0.29
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ]
    },
    "4x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.7
        },
        {
          "qty": 25,
          "price": 1.7
        },
        {
          "qty": 50,
          "price": 1.7
        },
        {
          "qty": 100,
          "price": 1.19
        },
        {
          "qty": 200,
          "price": 0.9
        },
        {
          "qty": 300,
          "price": 0.78
        },
        {
          "qty": 500,
          "price": 0.66
        },
        {
          "qty": 1000,
          "price": 0.56
        },
        {
          "qty": 2000,
          "price": 0.46
        },
        {
          "qty": 3000,
          "price": 0.39
        },
        {
          "qty": 4000,
          "price": 0.39
        },
        {
          "qty": 5000,
          "price": 0.36
        },
        {
          "qty": 10000,
          "price": 0.34
        },
        {
          "qty": 11000,
          "price": 0.31
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.79
        },
        {
          "qty": 25,
          "price": 1.79
        },
        {
          "qty": 50,
          "price": 1.79
        },
        {
          "qty": 100,
          "price": 1.25
        },
        {
          "qty": 200,
          "price": 0.95
        },
        {
          "qty": 300,
          "price": 0.82
        },
        {
          "qty": 500,
          "price": 0.7
        },
        {
          "qty": 1000,
          "price": 0.59
        },
        {
          "qty": 2000,
          "price": 0.48
        },
        {
          "qty": 3000,
          "price": 0.41
        },
        {
          "qty": 4000,
          "price": 0.41
        },
        {
          "qty": 5000,
          "price": 0.38
        },
        {
          "qty": 10000,
          "price": 0.36
        },
        {
          "qty": 11000,
          "price": 0.32
        }
      ]
    },
    "5.5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.39
        },
        {
          "qty": 25,
          "price": 2.39
        },
        {
          "qty": 50,
          "price": 2.39
        },
        {
          "qty": 100,
          "price": 1.79
        },
        {
          "qty": 200,
          "price": 1.43
        },
        {
          "qty": 300,
          "price": 1.26
        },
        {
          "qty": 500,
          "price": 1.12
        },
        {
          "qty": 1000,
          "price": 0.95
        },
        {
          "qty": 2000,
          "price": 0.79
        },
        {
          "qty": 3000,
          "price": 0.74
        },
        {
          "qty": 4000,
          "price": 0.74
        },
        {
          "qty": 5000,
          "price": 0.67
        },
        {
          "qty": 10000,
          "price": 0.63
        },
        {
          "qty": 11000,
          "price": 0.62
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.51
        },
        {
          "qty": 25,
          "price": 2.51
        },
        {
          "qty": 50,
          "price": 2.51
        },
        {
          "qty": 100,
          "price": 1.88
        },
        {
          "qty": 200,
          "price": 1.5
        },
        {
          "qty": 300,
          "price": 1.33
        },
        {
          "qty": 500,
          "price": 1.18
        },
        {
          "qty": 1000,
          "price": 1
        },
        {
          "qty": 2000,
          "price": 0.83
        },
        {
          "qty": 3000,
          "price": 0.78
        },
        {
          "qty": 4000,
          "price": 0.78
        },
        {
          "qty": 5000,
          "price": 0.7
        },
        {
          "qty": 10000,
          "price": 0.67
        },
        {
          "qty": 11000,
          "price": 0.65
        }
      ]
    },
    "11x3": {
      "contour": [
        {
          "qty": 15,
          "price": 2.47
        },
        {
          "qty": 25,
          "price": 2.47
        },
        {
          "qty": 50,
          "price": 2.47
        },
        {
          "qty": 100,
          "price": 1.85
        },
        {
          "qty": 200,
          "price": 1.48
        },
        {
          "qty": 300,
          "price": 1.31
        },
        {
          "qty": 500,
          "price": 1.16
        },
        {
          "qty": 1000,
          "price": 0.99
        },
        {
          "qty": 2000,
          "price": 0.82
        },
        {
          "qty": 3000,
          "price": 0.77
        },
        {
          "qty": 4000,
          "price": 0.77
        },
        {
          "qty": 5000,
          "price": 0.69
        },
        {
          "qty": 10000,
          "price": 0.66
        },
        {
          "qty": 11000,
          "price": 0.64
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.6
        },
        {
          "qty": 25,
          "price": 2.6
        },
        {
          "qty": 50,
          "price": 2.6
        },
        {
          "qty": 100,
          "price": 1.95
        },
        {
          "qty": 200,
          "price": 1.56
        },
        {
          "qty": 300,
          "price": 1.38
        },
        {
          "qty": 500,
          "price": 1.22
        },
        {
          "qty": 1000,
          "price": 1.04
        },
        {
          "qty": 2000,
          "price": 0.86
        },
        {
          "qty": 3000,
          "price": 0.8
        },
        {
          "qty": 4000,
          "price": 0.8
        },
        {
          "qty": 5000,
          "price": 0.73
        },
        {
          "qty": 10000,
          "price": 0.69
        },
        {
          "qty": 11000,
          "price": 0.67
        }
      ]
    }
  },
  "clear": {
    "3x2": {
      "contour": [
        {
          "qty": 15,
          "price": 1.44
        },
        {
          "qty": 25,
          "price": 1.44
        },
        {
          "qty": 50,
          "price": 1.44
        },
        {
          "qty": 100,
          "price": 0.93
        },
        {
          "qty": 200,
          "price": 0.66
        },
        {
          "qty": 300,
          "price": 0.56
        },
        {
          "qty": 500,
          "price": 0.46
        },
        {
          "qty": 1000,
          "price": 0.37
        },
        {
          "qty": 2000,
          "price": 0.28
        },
        {
          "qty": 3000,
          "price": 0.24
        },
        {
          "qty": 4000,
          "price": 0.24
        },
        {
          "qty": 5000,
          "price": 0.22
        },
        {
          "qty": 10000,
          "price": 0.2
        },
        {
          "qty": 11000,
          "price": 0.19
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.51
        },
        {
          "qty": 25,
          "price": 1.51
        },
        {
          "qty": 50,
          "price": 1.51
        },
        {
          "qty": 100,
          "price": 0.98
        },
        {
          "qty": 200,
          "price": 0.69
        },
        {
          "qty": 300,
          "price": 0.59
        },
        {
          "qty": 500,
          "price": 0.48
        },
        {
          "qty": 1000,
          "price": 0.39
        },
        {
          "qty": 2000,
          "price": 0.29
        },
        {
          "qty": 3000,
          "price": 0.26
        },
        {
          "qty": 4000,
          "price": 0.26
        },
        {
          "qty": 5000,
          "price": 0.23
        },
        {
          "qty": 10000,
          "price": 0.22
        },
        {
          "qty": 11000,
          "price": 0.2
        }
      ]
    },
    "4x3": {
      "contour": [
        {
          "qty": 15,
          "price": 1.7
        },
        {
          "qty": 25,
          "price": 1.7
        },
        {
          "qty": 50,
          "price": 1.7
        },
        {
          "qty": 100,
          "price": 1.19
        },
        {
          "qty": 200,
          "price": 0.9
        },
        {
          "qty": 300,
          "price": 0.78
        },
        {
          "qty": 500,
          "price": 0.66
        },
        {
          "qty": 1000,
          "price": 0.56
        },
        {
          "qty": 2000,
          "price": 0.46
        },
        {
          "qty": 3000,
          "price": 0.39
        },
        {
          "qty": 4000,
          "price": 0.39
        },
        {
          "qty": 5000,
          "price": 0.36
        },
        {
          "qty": 10000,
          "price": 0.34
        },
        {
          "qty": 11000,
          "price": 0.31
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 1.79
        },
        {
          "qty": 25,
          "price": 1.79
        },
        {
          "qty": 50,
          "price": 1.79
        },
        {
          "qty": 100,
          "price": 1.25
        },
        {
          "qty": 200,
          "price": 0.95
        },
        {
          "qty": 300,
          "price": 0.82
        },
        {
          "qty": 500,
          "price": 0.7
        },
        {
          "qty": 1000,
          "price": 0.59
        },
        {
          "qty": 2000,
          "price": 0.48
        },
        {
          "qty": 3000,
          "price": 0.41
        },
        {
          "qty": 4000,
          "price": 0.41
        },
        {
          "qty": 5000,
          "price": 0.38
        },
        {
          "qty": 10000,
          "price": 0.36
        },
        {
          "qty": 11000,
          "price": 0.32
        }
      ]
    },
    "5.5": {
      "contour": [
        {
          "qty": 15,
          "price": 2.39
        },
        {
          "qty": 25,
          "price": 2.39
        },
        {
          "qty": 50,
          "price": 2.39
        },
        {
          "qty": 100,
          "price": 1.79
        },
        {
          "qty": 200,
          "price": 1.43
        },
        {
          "qty": 300,
          "price": 1.26
        },
        {
          "qty": 500,
          "price": 1.12
        },
        {
          "qty": 1000,
          "price": 0.95
        },
        {
          "qty": 2000,
          "price": 0.79
        },
        {
          "qty": 3000,
          "price": 0.74
        },
        {
          "qty": 4000,
          "price": 0.74
        },
        {
          "qty": 5000,
          "price": 0.67
        },
        {
          "qty": 10000,
          "price": 0.63
        },
        {
          "qty": 11000,
          "price": 0.62
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.51
        },
        {
          "qty": 25,
          "price": 2.51
        },
        {
          "qty": 50,
          "price": 2.51
        },
        {
          "qty": 100,
          "price": 1.88
        },
        {
          "qty": 200,
          "price": 1.5
        },
        {
          "qty": 300,
          "price": 1.33
        },
        {
          "qty": 500,
          "price": 1.18
        },
        {
          "qty": 1000,
          "price": 1
        },
        {
          "qty": 2000,
          "price": 0.83
        },
        {
          "qty": 3000,
          "price": 0.78
        },
        {
          "qty": 4000,
          "price": 0.78
        },
        {
          "qty": 5000,
          "price": 0.7
        },
        {
          "qty": 10000,
          "price": 0.67
        },
        {
          "qty": 11000,
          "price": 0.65
        }
      ]
    },
    "11x3": {
      "contour": [
        {
          "qty": 15,
          "price": 2.47
        },
        {
          "qty": 25,
          "price": 2.47
        },
        {
          "qty": 50,
          "price": 2.47
        },
        {
          "qty": 100,
          "price": 1.85
        },
        {
          "qty": 200,
          "price": 1.48
        },
        {
          "qty": 300,
          "price": 1.31
        },
        {
          "qty": 500,
          "price": 1.16
        },
        {
          "qty": 1000,
          "price": 0.99
        },
        {
          "qty": 2000,
          "price": 0.82
        },
        {
          "qty": 3000,
          "price": 0.77
        },
        {
          "qty": 4000,
          "price": 0.77
        },
        {
          "qty": 5000,
          "price": 0.69
        },
        {
          "qty": 10000,
          "price": 0.66
        },
        {
          "qty": 11000,
          "price": 0.64
        }
      ],
      "kiss": [
        {
          "qty": 15,
          "price": 2.6
        },
        {
          "qty": 25,
          "price": 2.6
        },
        {
          "qty": 50,
          "price": 2.6
        },
        {
          "qty": 100,
          "price": 1.95
        },
        {
          "qty": 200,
          "price": 1.56
        },
        {
          "qty": 300,
          "price": 1.38
        },
        {
          "qty": 500,
          "price": 1.22
        },
        {
          "qty": 1000,
          "price": 1.04
        },
        {
          "qty": 2000,
          "price": 0.86
        },
        {
          "qty": 3000,
          "price": 0.8
        },
        {
          "qty": 4000,
          "price": 0.8
        },
        {
          "qty": 5000,
          "price": 0.73
        },
        {
          "qty": 10000,
          "price": 0.69
        },
        {
          "qty": 11000,
          "price": 0.67
        }
      ]
    }
  },
  "static-cling": {
    "3x2": {
      "contour": [
        { "qty": 15, "price": 1.25 },
        { "qty": 25, "price": 1.25 },
        { "qty": 50, "price": 1.25 },
        { "qty": 100, "price": 0.81 },
        { "qty": 200, "price": 0.57 },
        { "qty": 300, "price": 0.49 },
        { "qty": 500, "price": 0.40 },
        { "qty": 1000, "price": 0.33 },
        { "qty": 2000, "price": 0.23 },
        { "qty": 3000, "price": 0.21 },
        { "qty": 4000, "price": 0.21 },
        { "qty": 5000, "price": 0.18 },
        { "qty": 10000, "price": 0.17 },
        { "qty": 11000, "price": 0.15 }
      ]
    },
    "4x3": {
      "contour": [
        { "qty": 15, "price": 1.38 },
        { "qty": 25, "price": 1.38 },
        { "qty": 50, "price": 1.38 },
        { "qty": 100, "price": 0.97 },
        { "qty": 200, "price": 0.73 },
        { "qty": 300, "price": 0.64 },
        { "qty": 500, "price": 0.54 },
        { "qty": 1000, "price": 0.46 },
        { "qty": 2000, "price": 0.37 },
        { "qty": 3000, "price": 0.32 },
        { "qty": 4000, "price": 0.32 },
        { "qty": 5000, "price": 0.29 },
        { "qty": 10000, "price": 0.28 },
        { "qty": 11000, "price": 0.25 }
      ]
    },
    "5.5": {
      "contour": [
        { "qty": 15, "price": 1.94 },
        { "qty": 25, "price": 1.94 },
        { "qty": 50, "price": 1.94 },
        { "qty": 100, "price": 1.46 },
        { "qty": 200, "price": 1.16 },
        { "qty": 300, "price": 1.03 },
        { "qty": 500, "price": 0.91 },
        { "qty": 1000, "price": 0.78 },
        { "qty": 2000, "price": 0.68 },
        { "qty": 3000, "price": 0.60 },
        { "qty": 4000, "price": 0.60 },
        { "qty": 5000, "price": 0.54 },
        { "qty": 10000, "price": 0.52 },
        { "qty": 11000, "price": 0.50 }
      ]
    },
    "11x3": {
      "contour": [
        { "qty": 15, "price": 2.01 },
        { "qty": 25, "price": 2.01 },
        { "qty": 50, "price": 2.01 },
        { "qty": 100, "price": 1.51 },
        { "qty": 200, "price": 1.21 },
        { "qty": 300, "price": 1.07 },
        { "qty": 500, "price": 0.94 },
        { "qty": 1000, "price": 0.80 },
        { "qty": 2000, "price": 0.66 },
        { "qty": 3000, "price": 0.62 },
        { "qty": 4000, "price": 0.62 },
        { "qty": 5000, "price": 0.56 },
        { "qty": 10000, "price": 0.53 },
        { "qty": 11000, "price": 0.52 }
      ]
    }
  }
};

// Sticker sheets: surcharge by number of individual cuts per sheet
export const SHEET_CUT_SURCHARGE = [
  { maxCuts: 4, pct: 0 },
  { maxCuts: 8, pct: 0.05 },
  { maxCuts: 12, pct: 0.10 },
];
