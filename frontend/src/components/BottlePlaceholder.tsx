import { cn } from '@/lib/helpers'

interface BottlePlaceholderProps {
  /** Variação visual — distribui formas diferentes por id de produto. */
  variant?: number
  className?: string
  /** Estilo apagado para itens esgotados. */
  muted?: boolean
}

/**
 * Frasco vetorial usado como placeholder de imagem de produto.
 *
 * A API (ProdutoResponseDTO) não retorna imagem na listagem, então
 * todo produto usa este placeholder — fiel ao design system, que
 * já apresenta os cards de produto com frascos vetoriais.
 *
 * Três formas alternam por `variant` para dar variedade à grade.
 */
export function BottlePlaceholder({
  variant = 0,
  className,
  muted = false,
}: BottlePlaceholderProps) {
  const stroke = muted ? '#A39E97' : '#350C12'
  const accent = muted ? '#A39E97' : '#7A1F2B'
  const shape = variant % 3

  return (
    <svg
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-auto w-[38%]', className)}
      aria-hidden
    >
      {shape === 0 && (
        <>
          {/* Frasco alto com tampa */}
          <rect
            x="36"
            y="6"
            width="28"
            height="12"
            rx="1.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path
            d="M34 20 Q34 28 30 34 L30 124 Q30 132 38 132 L62 132 Q70 132 70 124 L70 34 Q66 28 66 20 Z"
            fill={muted ? '#F7F5F1' : '#fff'}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="9"
            fontStyle="italic"
            fill={stroke}
          >
            Revele
          </text>
        </>
      )}
      {shape === 1 && (
        <>
          {/* Pote largo */}
          <rect
            x="36"
            y="14"
            width="28"
            height="8"
            rx="1"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <rect
            x="24"
            y="22"
            width="52"
            height="106"
            rx="3"
            fill={muted ? '#F7F5F1' : '#FBF5F6'}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="76"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="10"
            fontStyle="italic"
            fill={stroke}
          >
            Revele
          </text>
        </>
      )}
      {shape === 2 && (
        <>
          {/* Frasco de fragrância */}
          <rect
            x="44"
            y="6"
            width="12"
            height="14"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path
            d="M40 20 Q40 30 32 38 L32 116 Q32 130 50 130 Q68 130 68 116 L68 38 Q60 30 60 20 Z"
            fill={muted ? '#F7F5F1' : '#fff'}
            stroke={stroke}
            strokeWidth="1.2"
          />
          <text
            x="50"
            y="82"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="9"
            fontStyle="italic"
            fill={stroke}
          >
            Revele
          </text>
        </>
      )}
      <text
        x="50"
        y={shape === 1 ? 88 : 84}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="3"
        letterSpacing="0.5"
        fill={accent}
      >
        COSMÉTICOS
      </text>
    </svg>
  )
}
