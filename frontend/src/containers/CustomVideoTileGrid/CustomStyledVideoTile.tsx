// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';
// import { VideoTileProps } from './CustomVideoTile';
import { BaseSdkProps } from '.';
import { space } from 'styled-system';
import { VideoTileProps } from './CustomContentShare';

export const baseStyles = ({ css }: BaseSdkProps ) =>
  css ? `@media { ${css} };` : '';
export const baseSpacing = (props: BaseSdkProps ) => space(props);


export const ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const CustomStyledVideoTile = styled.div<VideoTileProps>`
  height: 100%;
  width: 100%;
  position: relative;
  background: ${props => props.theme.colors.greys.grey60};

  video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: ${props => props.objectFit || 'cover'}};
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: ${props => props.objectFit || 'cover'}};
  }

  .ch-icon {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    background-color: papayawhip; /* TODO: figure out what this is supposed to be */
    margin-right: 0.5rem;
    flex: 0 0 1.5rem;
  }

  .ch-nameplate {
    backdrop-filter: blur(20px);
    background-color: rgba(46, 47, 52, 0.85);
    border-radius: 0.25rem;
    bottom: 0.5rem;
    color: ${props => props.theme.colors.greys.white};
    left: 0.5rem;
    max-width: calc(100% - 2rem);
    padding: 0.5rem;
    position: absolute;

    div {
      ${ellipsis};
      display: flex;
      align-items: center;
    }

    .ch-text {
      font-size: ${props => props.theme.fontSizes.text.fontSize};
      ${ellipsis};
      margin: 0;
    }
  }

  ${baseSpacing}
  ${baseStyles}
`;
