import { unlink } from 'node:fs/promises'

/**
 * The function `rmFile` removes a file at a given filepath and returns a boolean
 * indicating success or failure.
 * @param {string} filepath - The `filepath` parameter is a string that represents
 * the path of the file that needs to be removed.
 * @returns a Promise that resolves to a boolean value. If the file is successfully
 * deleted, the Promise resolves to `true`. If there is an error while deleting the
 * file, the Promise resolves to `false`.
 */
export async function rmFile(filepath: string): Promise<boolean> {
  try {
    await unlink(filepath)
    return true
  } catch (e: Error | any) {
    console.log(e?.message)
    return false
  }
}