import { useState, useEffect } from 'react';
import { attributeService, ApiEmotion, ApiTexture, ApiShape } from '../../../api';

interface AttributesState {
  emotions: ApiEmotion[];
  textures: ApiTexture[];
  shapes: ApiShape[];
  isLoading: boolean;
  error: string | null;
}

export function useAttributes() {
  const [state, setState] = useState<AttributesState>({
    emotions: [],
    textures: [],
    shapes: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const [emotions, textures, shapes] = await Promise.all([
          attributeService.getEmotions(),
          attributeService.getTextures(),
          attributeService.getShapes(),
        ]);

        setState({
          emotions,
          textures,
          shapes,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load attributes',
        }));
      }
    };

    fetchAttributes();
  }, []);

  return state;
}
