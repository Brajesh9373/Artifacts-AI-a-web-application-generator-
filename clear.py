import os
def clean_file(file_path):
    import os

    symbols = ["typescript", "tsx", "react", "javascript", "```", "'''", '"""', "#"]

    # Read all lines from file
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    if not lines:
        print("The file is empty.")
        return

    # Flags to track lines to remove
    remove_first = any(symbol in lines[0].lower() for symbol in symbols)
    remove_last = any(symbol in lines[-1].lower() for symbol in symbols)

    # Debug print
    print(f"Removing first line: {remove_first}, Removing last line: {remove_last}")

    # Modify the lines accordingly
    if remove_first:
        lines = lines[1:]
    if remove_last and lines:  # recheck to avoid removing from empty list
        lines = lines[:-1]

    # Write the updated lines back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.writelines(lines)

    print("File cleaned and saved successfully.")

file_path = os.path.abspath("add.tsx")  # Replace with your target file
clean_file(file_path)
