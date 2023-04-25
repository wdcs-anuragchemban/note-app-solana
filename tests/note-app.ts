import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NoteApp } from "../target/types/note_app";
import { assert } from "chai";

describe("note-app", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace.NoteApp as Program<NoteApp>;
  const noteKeypair = anchor.web3.Keypair.generate();
  const systemProgram = anchor.web3.SystemProgram.programId;

  it("Create Note", async () => {
    await program.methods
      .createNote("Create Note Test")
      .accounts({
        note: noteKeypair.publicKey,
        user: provider.publicKey,
        systemProgram: systemProgram,
      })
      .signers([noteKeypair])
      .rpc();

    let newNote = await program.account.note.fetch(noteKeypair.publicKey);

    assert.strictEqual(newNote.content, "Create Note Test");
    assert.strictEqual(newNote.user.toBase58(), provider.publicKey.toBase58());
  });

  it("Delete Note Account", async () => {
    await program.methods
      .deleteNote()
      .accounts({ note: noteKeypair.publicKey, user: provider.publicKey })
      .rpc();

    let deletedNote = await program.account.note.fetchNullable(
      noteKeypair.publicKey
    );

    assert.ok(deletedNote == null);
  });
});
