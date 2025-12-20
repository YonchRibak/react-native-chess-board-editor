/**
 * Default editor tools passed to renderEditorTools
 */
export interface DefaultEditorTools {
  turnToggler: React.ReactNode;
  castlingRights: React.ReactNode;
  enPassantInput: React.ReactNode;
}

/**
 * Editor tools layout - controls which tools appear in panel vs outside
 */
export interface EditorToolsLayout {
  /** Content to render inside the collapsible panel */
  inPanel: React.ReactNode;
  /** Content to render outside the panel (between panel and FEN display) */
  outside?: React.ReactNode;
}
